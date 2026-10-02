from pydantic import BaseModel, Field

from app.schemas.config import ExperimentConfig


class ExperimentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    description: str = Field("", max_length=500)
    config: ExperimentConfig | None = None


class ExperimentUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=80)
    description: str | None = Field(None, max_length=500)
    config: ExperimentConfig | None = None


class ExperimentRename(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)


class ExperimentRecord(BaseModel):
    id: str
    name: str
    description: str
    created_at: str
    updated_at: str
    config: ExperimentConfig
