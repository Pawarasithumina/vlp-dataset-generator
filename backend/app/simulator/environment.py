"""Room geometry: LED and noise-source placement."""
from __future__ import annotations

import numpy as np

from app.schemas.config import ExperimentConfig

WALLS = ["South", "East", "North", "West"]
NOISE_CYCLE = ["gaussian", "sinusoidal", "impulsive"]


def led_positions(cfg: ExperimentConfig, rng: np.random.Generator) -> np.ndarray:
    W, L, H = cfg.room.width, cfg.room.length, cfg.room.height
    n, mode = cfg.led.count, cfg.led.placement
    if mode == "grid":
        cols = max(1, int(np.ceil(np.sqrt(n * W / L))))
        rows = int(np.ceil(n / cols))
        idx = np.arange(n)
        xy = np.column_stack([((idx % cols) + 0.5) * W / cols, ((idx // cols) + 0.5) * L / rows])
    elif mode == "ring":
        if n == 1:
            xy = np.array([[W / 2, L / 2]])
        else:
            ang = 2 * np.pi * np.arange(n) / n
            r = 0.3 * min(W, L)
            xy = np.column_stack([W / 2 + r * np.cos(ang), L / 2 + r * np.sin(ang)])
    else:  # random
        m = min(0.3, W / 4, L / 4)
        xy = rng.uniform([m, m], [W - m, L - m], size=(n, 2))
    return np.column_stack([xy, np.full(n, H)])


def _wall_point(wall: str, u: float, z: float, W: float, L: float) -> tuple[float, float, float]:
    if wall == "South":
        return (u * W, 0.0, z)
    if wall == "North":
        return (u * W, L, z)
    if wall == "West":
        return (0.0, u * L, z)
    return (W, u * L, z)


def noise_sources(cfg: ExperimentConfig, rng: np.random.Generator) -> list[dict]:
    W, L, H = cfg.room.width, cfg.room.length, cfg.room.height
    nz = cfg.noise
    out: list[dict] = []
    for i in range(nz.count):
        if nz.placement == "even":
            wall = WALLS[i % 4]
            k = i // 4
            u = 0.5 if k == 0 else 0.25 + 0.5 * ((k * 0.618) % 1)
            x, y, z = _wall_point(wall, u, 0.55 * H, W, L)
        elif nz.placement == "random":
            wall = WALLS[int(rng.integers(0, 4))]
            x, y, z = _wall_point(wall, float(rng.uniform(0.1, 0.9)), float(rng.uniform(0.3, 0.9) * H), W, L)
        else:  # corners
            wall = WALLS[i % 4]
            x, y, z = {
                "South": (0.15, 0.0, 0.8 * H),
                "East": (W, 0.15, 0.8 * H),
                "North": (W - 0.15, L, 0.8 * H),
                "West": (0.0, L - 0.15, 0.8 * H),
            }[wall]
        ntype = NOISE_CYCLE[i % 3] if nz.type == "mixed" else nz.type
        out.append({
            "id": f"N{i + 1}", "wall": wall, "x": float(x), "y": float(y), "z": float(z),
            "type": ntype, "intensity": nz.intensity, "frequency": nz.frequency,
        })
    return out
