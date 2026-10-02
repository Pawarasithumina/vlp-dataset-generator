from pydantic import BaseModel


class DatasetCheck(BaseModel):
    name: str
    passed: bool
    severity: str
    detail: str


class DatasetValidation(BaseModel):
    valid: bool
    rows: int
    columns: int
    checks: list[DatasetCheck]
