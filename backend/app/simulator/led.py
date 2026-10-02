import numpy as np


def lambertian_order(half_angle_deg: float) -> float:
    """Lambertian mode number m from the half-power semi-angle: m = -ln2 / ln(cos(phi_1/2))."""
    a = float(np.clip(half_angle_deg, 1.0, 89.0))
    return float(-np.log(2.0) / np.log(np.cos(np.radians(a))))
