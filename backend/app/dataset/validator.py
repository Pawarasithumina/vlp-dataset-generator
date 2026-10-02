from __future__ import annotations

import numpy as np
import pandas as pd


def validate_dataset(df: pd.DataFrame, raw: dict) -> dict:
    cfg = raw["cfg"]
    checks: list[dict] = []

    def add(name: str, passed: bool, detail: str, severity: str = "error") -> None:
        checks.append({"name": name, "passed": bool(passed), "severity": severity, "detail": detail})

    add("Row count matches configuration", len(df) == cfg.simulation.samples,
        f"{len(df)} rows, {cfg.simulation.samples} samples configured")
    numeric = df.to_numpy(dtype=float)
    add("No missing or infinite values", bool(np.isfinite(numeric).all()), "All cells are finite numbers")
    add("Time axis strictly increasing", bool((np.diff(df["time_s"]) > 0).all()), "time_s grows monotonically")
    inside = ((df["rx_x_m"].between(0, cfg.room.width)) & (df["rx_y_m"].between(0, cfg.room.length))
              & (df["rx_z_m"].between(0, cfg.room.height))).all()
    add("Receiver stays inside the room", bool(inside), "All positions are within the room bounds")
    rss_cols = [c for c in df.columns if c.startswith("rss_L")]
    add("RSS values non-negative", bool((df[rss_cols] >= 0).all().all()), "Received power cannot be negative")
    add("At least one LED in FOV for every sample",
        bool((df[[c for c in df.columns if c.startswith("rss_clean_")]] > 0).any(axis=1).all()),
        "Samples with no LED in view carry no positioning information", severity="warning")
    valid = all(c["passed"] for c in checks if c["severity"] == "error")
    return {"valid": valid, "rows": int(len(df)), "columns": int(df.shape[1]), "checks": checks}
