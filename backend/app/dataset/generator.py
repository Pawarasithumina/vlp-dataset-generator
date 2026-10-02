"""Builds the full dataset (one row per sample) from a simulation run."""
from __future__ import annotations

import numpy as np
import pandas as pd


def build_dataframe(raw: dict) -> pd.DataFrame:
    cols: dict[str, np.ndarray] = {
        "sample": np.arange(len(raw["t"])),
        "time_s": raw["t"],
        "rx_x_m": raw["rx"][:, 0],
        "rx_y_m": raw["rx"][:, 1],
        "rx_z_m": raw["rx"][:, 2],
    }
    for i in range(raw["rss"].shape[0]):
        cols[f"rss_L{i + 1}_uW"] = raw["rss"][i]
    for i in range(raw["rss_clean"].shape[0]):
        cols[f"rss_clean_L{i + 1}_uW"] = raw["rss_clean"][i]
    for i in range(raw["dist"].shape[0]):
        cols[f"dist_L{i + 1}_m"] = raw["dist"][i]
    for i, s in enumerate(raw["sources"]):
        cols[f"noise_{s['id']}_uW"] = raw["noise"][i]
    cols["noise_total_uW"] = raw["noise_total"]
    return pd.DataFrame(cols).round(6)
