"""In-memory holder for the most recent simulation run (single-user research tool)."""
from __future__ import annotations

from dataclasses import dataclass, field

import pandas as pd


@dataclass
class Store:
    raw: dict | None = None
    df: pd.DataFrame | None = None
    validation: dict | None = None
    config: object | None = None
    extras: dict = field(default_factory=dict)


store = Store()
