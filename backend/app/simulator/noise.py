"""Noise sources as seen by the receiver."""
from __future__ import annotations

import numpy as np

from app.schemas.config import ExperimentConfig
from app.simulator import signals


def generate_noise(cfg: ExperimentConfig, sources: list[dict], rx: np.ndarray,
                   t: np.ndarray, rng: np.random.Generator) -> np.ndarray:
    """Returns (n_sources, T) noise power at the receiver [uW].

    Each source emits a waveform scaled by its intensity and attenuated with
    the source-to-receiver distance: coupling = 1 / (1 + d^2).
    """
    n, dt = len(t), cfg.simulation.time_step
    out = np.zeros((len(sources), n))
    for i, s in enumerate(sources):
        if s["type"] == "gaussian":
            w = signals.gaussian_lowpass(n, dt, s["frequency"], rng)
        elif s["type"] == "sinusoidal":
            w = signals.sinusoid(t, s["frequency"], rng)
        else:
            w = signals.impulsive(n, dt, s["frequency"], rng)
        d = np.linalg.norm(rx - np.array([s["x"], s["y"], s["z"]]), axis=1)
        out[i] = s["intensity"] * w / (1.0 + d ** 2)
    return out
