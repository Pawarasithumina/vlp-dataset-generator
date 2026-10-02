"""Orchestrates one full simulation run and serialises the result."""
from __future__ import annotations

import time
from datetime import datetime, timezone

import numpy as np

from app.schemas.config import ExperimentConfig
from app.simulator.distance import pairwise_distance
from app.simulator.environment import led_positions, noise_sources
from app.simulator.led import lambertian_order
from app.simulator.noise import generate_noise
from app.simulator.receiver import generate_trajectory
from app.simulator.rss import compute_rss


def _stats(x: np.ndarray) -> dict:
    return {
        "mean": float(np.mean(x)), "std": float(np.std(x)),
        "min": float(np.min(x)), "max": float(np.max(x)),
        "rms": float(np.sqrt(np.mean(x ** 2))),
    }


def run_simulation(cfg: ExperimentConfig) -> dict:
    t0 = time.perf_counter()
    n, dt, seed = cfg.simulation.samples, cfg.simulation.time_step, cfg.seed
    t = np.arange(n) * dt

    rx = generate_trajectory(cfg, t, np.random.default_rng([seed, 3]))
    leds = led_positions(cfg, np.random.default_rng([seed, 1]))
    dist = pairwise_distance(leds, rx)
    clean, in_fov = compute_rss(cfg, leds, rx)

    if cfg.noise.enabled and cfg.noise.count > 0:
        sources = noise_sources(cfg, np.random.default_rng([seed, 2]))
        noise = generate_noise(cfg, sources, rx, t, np.random.default_rng([seed, 4]))
        total = noise.sum(axis=0)
        rss = np.maximum(clean + total[None, :], 0.0)
    else:
        sources, noise, total, rss = [], np.zeros((0, n)), np.zeros(n), clean

    step = np.linalg.norm(np.diff(rx, axis=0), axis=1)
    speed = np.concatenate([step[:1], step]) / dt
    path = np.concatenate([[0.0], np.cumsum(step)])

    return {
        "cfg": cfg, "t": t, "rx": rx, "leds": leds, "sources": sources, "dist": dist,
        "rss_clean": clean, "rss": rss, "in_fov": in_fov, "noise": noise,
        "noise_total": total, "speed": speed, "path": path,
        "compute_ms": (time.perf_counter() - t0) * 1000.0,
    }


def serialize(raw: dict) -> dict:
    """Plain-Python payload for the frontend (no NaN, rounded floats)."""
    cfg: ExperimentConfig = raw["cfg"]
    t, rx, rss, clean = raw["t"], raw["rx"], raw["rss"], raw["rss_clean"]
    total, noise = raw["noise_total"], raw["noise"]
    m = lambertian_order(cfg.led.half_angle)
    duration = float(t[-1] - t[0])

    rss_stats = []
    for i in range(len(raw["leds"])):
        s = _stats(rss[i])
        p_sig = float(np.mean(clean[i] ** 2))
        p_noise = float(np.mean(total ** 2))
        s["snr_db"] = float(10 * np.log10(p_sig / p_noise)) if p_sig > 0 and p_noise > 0 else None
        s["in_fov_fraction"] = float(np.mean(raw["in_fov"][i]))
        rss_stats.append({"id": f"L{i + 1}", **s})

    return {
        "meta": {
            "samples": int(len(t)), "duration": duration, "time_step": cfg.simulation.time_step,
            "n_leds": int(len(raw["leds"])), "n_noise": int(len(raw["sources"])), "seed": cfg.seed,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "compute_ms": round(raw["compute_ms"], 2),
        },
        "config": cfg.model_dump(),
        "time": t.round(6).tolist(),
        "receiver": {
            "x": rx[:, 0].round(5).tolist(), "y": rx[:, 1].round(5).tolist(), "z": rx[:, 2].round(5).tolist(),
            "speed": raw["speed"].round(5).tolist(), "path_length": raw["path"].round(5).tolist(),
        },
        "leds": [
            {"id": f"L{i + 1}", "x": float(p[0]), "y": float(p[1]), "z": float(p[2]),
             "power": cfg.led.power, "half_angle": cfg.led.half_angle, "lambertian_order": m}
            for i, p in enumerate(raw["leds"])
        ],
        "noise_sources": raw["sources"],
        "rss": rss.round(6).tolist(),
        "rss_clean": clean.round(6).tolist(),
        "distances": raw["dist"].round(5).tolist(),
        "noise": noise.round(6).tolist(),
        "noise_total": total.round(6).tolist(),
        "stats": {
            "rss": rss_stats,
            "noise": [{"id": s["id"], **_stats(noise[i])} for i, s in enumerate(raw["sources"])],
            "noise_total": _stats(total) if len(raw["sources"]) else None,
            "trajectory": {
                "path_length": float(raw["path"][-1]),
                "avg_velocity": float(raw["path"][-1] / duration) if duration > 0 else 0.0,
                "max_velocity": float(np.max(raw["speed"])),
                "duration": duration,
                "displacement": float(np.linalg.norm(rx[-1] - rx[0])),
            },
        },
    }
