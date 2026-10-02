import numpy as np


def pairwise_distance(leds: np.ndarray, rx: np.ndarray) -> np.ndarray:
    """Euclidean distance between every LED (n,3) and every receiver sample (T,3) -> (n,T)."""
    diff = leds[:, None, :] - rx[None, :, :]
    return np.linalg.norm(diff, axis=2)
