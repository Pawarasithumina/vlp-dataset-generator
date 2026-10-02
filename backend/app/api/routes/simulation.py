from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.dataset.generator import build_dataframe
from app.dataset.validator import validate_dataset
from app.schemas.config import ExperimentConfig
from app.simulator.simulation import run_simulation, serialize
from app.store import store

router = APIRouter(prefix="/api/simulation", tags=["simulation"])


def _payload() -> dict:
    payload = serialize(store.raw)
    payload["validation"] = store.validation
    return payload


@router.post("/run")
def run(cfg: ExperimentConfig) -> JSONResponse:
    errors = [i for i in cfg.semantic_issues() if i["level"] == "error"]
    if errors:
        raise HTTPException(422, detail={"message": errors[0]["message"], "issues": errors})
    raw = run_simulation(cfg)
    df = build_dataframe(raw)
    store.raw, store.df, store.config = raw, df, cfg
    store.validation = validate_dataset(df, raw)
    return JSONResponse(_payload())


@router.get("/latest")
def latest() -> JSONResponse:
    if store.raw is None:
        raise HTTPException(404, detail="No simulation has been run yet.")
    return JSONResponse(_payload())
