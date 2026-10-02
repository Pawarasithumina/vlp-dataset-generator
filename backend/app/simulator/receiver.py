"""Receiver trajectory generation."""
from __future__ import annotations

import numpy as np

from app.schemas.config import ExperimentConfig

MARGIN = 0.1


def reflect(v: np.ndarray, lo: float, hi: float) -> np.ndarray:
    """Fold an unbounded coordinate into [lo, hi] by mirror reflection at the walls."""
    span = hi - lo
    if span <= 0:
        return np.full_like(v, lo)
    m = np.mod(v - lo, 2 * span)
    return lo + np.where(m <= span, m, 2 * span - m)


def generate_trajectory(cfg: ExperimentConfig, t: np.ndarray, rng: np.random.Generator) -> np.ndarray:
    W, L = cfg.room.width, cfg.room.length
    rc = cfg.receiver
    n = len(t)
    x0 = float(np.clip(rc.x, 0, W))
    y0 = float(np.clip(rc.y, 0, L))
    z = np.full(n, rc.z)
    v = rc.speed

    if rc.movement == "static" or v == 0:
        x, y = np.full(n, x0), np.full(n, y0)
    elif rc.movement == "linear":
        x = reflect(x0 + v * t, MARGIN, W - MARGIN)
        y = np.full(n, y0)
    elif rc.movement == "circular":
        r = max(0.1, min(0.3 * min(W, L), x0 - MARGIN, W - x0 - MARGIN, y0 - MARGIN, L - y0 - MARGIN))
        theta = (v / r) * t
        x, y = x0 + r * np.cos(theta), y0 + r * np.sin(theta)
    else:  # random_walk
        dt = np.diff(t, prepend=t[0])
        heading = np.cumsum(rng.normal(0, 0.25, n)) + rng.uniform(0, 2 * np.pi)
        x = reflect(x0 + np.cumsum(v * np.cos(heading) * dt), MARGIN, W - MARGIN)
        y = reflect(y0 + np.cumsum(v * np.sin(heading) * dt), MARGIN, L - MARGIN)
    return np.column_stack([x, y, z])
