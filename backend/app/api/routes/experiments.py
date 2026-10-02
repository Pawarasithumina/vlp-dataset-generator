import re

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from app.experiments import manager
from app.experiments.presets import list_presets
from app.schemas.experiment import ExperimentCreate, ExperimentRename, ExperimentUpdate

router = APIRouter(prefix="/api/experiments", tags=["experiments"])


def _guard(fn, *a):
    try:
        return fn(*a)
    except manager.NotFound:
        raise HTTPException(404, detail="Experiment not found.")


@router.get("/presets")
def presets() -> list[dict]:
    return list_presets()


@router.get("")
def list_all() -> list[dict]:
    return manager.list_experiments()


@router.post("", status_code=201)
def create(body: ExperimentCreate) -> dict:
    return manager.create(body.name, body.description, body.config)


@router.get("/{exp_id}")
def read(exp_id: str) -> dict:
    return _guard(manager.get, exp_id)


@router.put("/{exp_id}")
def update(exp_id: str, body: ExperimentUpdate) -> dict:
    return _guard(manager.update, exp_id, body.name, body.description, body.config)


@router.patch("/{exp_id}/rename")
def rename(exp_id: str, body: ExperimentRename) -> dict:
    return _guard(manager.update, exp_id, body.name, None, None)


@router.delete("/{exp_id}", status_code=204)
def remove(exp_id: str) -> Response:
    _guard(manager.delete, exp_id)
    return Response(status_code=204)


@router.post("/{exp_id}/duplicate", status_code=201)
def duplicate(exp_id: str) -> dict:
    return _guard(manager.duplicate, exp_id)


@router.get("/{exp_id}/export")
def export(exp_id: str) -> Response:
    import json
    rec = _guard(manager.get, exp_id)
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", rec["name"]).strip("-").lower() or "experiment"
    return Response(json.dumps(rec["config"], indent=2), media_type="application/json",
                    headers={"Content-Disposition": f'attachment; filename="{slug}.config.json"'})
