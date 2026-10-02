"""File-backed experiment storage (JSON files in /configs/experiments)."""
from __future__ import annotations

import json
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path

from app.schemas.config import ExperimentConfig

STORE_DIR = Path(__file__).resolve().parents[3] / "configs" / "experiments"
_ID = re.compile(r"^[a-f0-9]{8}$")


class NotFound(Exception):
    pass


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _path(exp_id: str) -> Path:
    if not _ID.match(exp_id):
        raise NotFound(exp_id)
    return STORE_DIR / f"{exp_id}.json"


def _write(rec: dict) -> dict:
    STORE_DIR.mkdir(parents=True, exist_ok=True)
    _path(rec["id"]).write_text(json.dumps(rec, indent=2), encoding="utf-8")
    return rec


def list_experiments() -> list[dict]:
    STORE_DIR.mkdir(parents=True, exist_ok=True)
    recs = [json.loads(p.read_text(encoding="utf-8")) for p in STORE_DIR.glob("*.json")]
    return sorted(recs, key=lambda r: r["updated_at"], reverse=True)


def get(exp_id: str) -> dict:
    p = _path(exp_id)
    if not p.exists():
        raise NotFound(exp_id)
    return json.loads(p.read_text(encoding="utf-8"))


def create(name: str, description: str, config: ExperimentConfig | None) -> dict:
    cfg = (config or ExperimentConfig()).model_copy(update={"name": name, "description": description})
    now = _now()
    return _write({"id": uuid.uuid4().hex[:8], "name": name, "description": description,
                   "created_at": now, "updated_at": now, "config": cfg.model_dump()})


def update(exp_id: str, name: str | None, description: str | None, config: ExperimentConfig | None) -> dict:
    rec = get(exp_id)
    if name is not None:
        rec["name"] = name
    if description is not None:
        rec["description"] = description
    cfg = config or ExperimentConfig.model_validate(rec["config"])
    rec["config"] = cfg.model_copy(update={"name": rec["name"], "description": rec["description"]}).model_dump()
    rec["updated_at"] = _now()
    return _write(rec)


def delete(exp_id: str) -> None:
    p = _path(exp_id)
    if not p.exists():
        raise NotFound(exp_id)
    p.unlink()


def duplicate(exp_id: str) -> dict:
    rec = get(exp_id)
    return create(f"{rec['name']} (copy)", rec["description"], ExperimentConfig.model_validate(rec["config"]))
