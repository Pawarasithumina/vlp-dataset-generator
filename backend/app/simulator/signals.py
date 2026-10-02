"""Unit-RMS noise waveforms."""
from __future__ import annotations

import numpy as np


def gaussian_lowpass(n: int, dt: float, cutoff: float, rng: np.random.Generator) -> np.ndarray:
    """White Gaussian noise through a first-order low-pass, normalised to unit variance."""
    x = rng.standard_normal(n)
    alpha = dt / (1.0 / (2 * np.pi * cutoff) + dt)
    y = np.empty(n)
    acc = 0.0
    for i in range(n):
        acc += alpha * (x[i] - acc)
        y[i] = acc
    s = y.std()
    return (y - y.mean()) / s if s > 0 else y


def sinusoid(t: np.ndarray, freq: float, rng: np.random.Generator) -> np.ndarray:
    """Tone with random phase and unit RMS (amplitude sqrt(2))."""
    return np.sqrt(2.0) * np.sin(2 * np.pi * freq * t + rng.uniform(0, 2 * np.pi))


def impulsive(n: int, dt: float, rate: float, rng: np.random.Generator) -> np.ndarray:
    """Sparse random spikes with an average event rate [Hz]."""
    p = min(1.0, rate * dt)
    return (rng.random(n) < p) * rng.normal(0.0, 3.0, n)
