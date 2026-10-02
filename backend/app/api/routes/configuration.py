from fastapi import APIRouter

from app.schemas.config import ExperimentConfig
from app.schemas.simulation import ConfigValidation

router = APIRouter(prefix="/api/configuration", tags=["configuration"])


@router.get("/default", response_model=ExperimentConfig)
def default_config() -> ExperimentConfig:
    return ExperimentConfig()


@router.post("/validate", response_model=ConfigValidation)
def validate(cfg: ExperimentConfig) -> ConfigValidation:
    issues = cfg.semantic_issues()
    return ConfigValidation(valid=not any(i["level"] == "error" for i in issues), issues=issues)
