"""Received signal strength from the Lambertian LED model (LOS channel)."""
from __future__ import annotations

import numpy as np

from app.schemas.config import ExperimentConfig
from app.simulator.distance import pairwise_distance
from app.simulator.led import lambertian_order


def compute_rss(cfg: ExperimentConfig, leds: np.ndarray, rx: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Returns (rss_uW (n,T), in_fov (n,T)).

    P_r = P_t (m+1) A / (2 pi d^2) * cos^m(phi) * T_s * g * cos(psi)   for psi <= FOV
    LEDs face down and the receiver faces up, so cos(phi) = cos(psi) = dz / d.
    """
    m = lambertian_order(cfg.led.half_angle)
    area = cfg.optical.receiver_area * 1e-4  # cm^2 -> m^2
    d = pairwise_distance(leds, rx)
    dz = leds[:, 2][:, None] - rx[:, 2][None, :]
    cos_a = np.divide(dz, d, out=np.zeros_like(d), where=d > 1e-9)
    cos_a = np.clip(cos_a, 0.0, 1.0)
    in_fov = (np.arccos(cos_a) <= np.radians(cfg.optical.fov)) & (dz > 0)
    pr = (cfg.led.power * (m + 1) * area / (2 * np.pi * np.maximum(d, 1e-6) ** 2)
          * cos_a ** m * cfg.optical.filter_gain * cfg.optical.concentrator_gain * cos_a)
    return np.where(in_fov, pr, 0.0) * 1e6, in_fov
