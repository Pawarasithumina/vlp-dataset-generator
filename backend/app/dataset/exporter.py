from __future__ import annotations

import io

import pandas as pd

from app.schemas.config import ExperimentConfig


def _flatten(d: dict, prefix: str = "") -> list[tuple[str, object]]:
    rows: list[tuple[str, object]] = []
    for k, v in d.items():
        key = f"{prefix}{k}"
        rows.extend(_flatten(v, key + ".") if isinstance(v, dict) else [(key, v)])
    return rows


def to_csv_bytes(df: pd.DataFrame) -> bytes:
    return df.to_csv(index=False).encode("utf-8")


def to_json_bytes(df: pd.DataFrame) -> bytes:
    return df.to_json(orient="records", indent=2).encode("utf-8")


def to_xlsx_bytes(df: pd.DataFrame, cfg: ExperimentConfig) -> bytes:
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="openpyxl") as xw:
        df.to_excel(xw, sheet_name="Dataset", index=False)
        df.describe().T.reset_index().rename(columns={"index": "column"}).to_excel(
            xw, sheet_name="Statistics", index=False)
        pd.DataFrame(_flatten(cfg.model_dump()), columns=["parameter", "value"]).to_excel(
            xw, sheet_name="Configuration", index=False)
    return buf.getvalue()


def config_json_bytes(cfg: ExperimentConfig) -> bytes:
    return cfg.model_dump_json(indent=2).encode("utf-8")
