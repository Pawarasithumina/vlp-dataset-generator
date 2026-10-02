from pydantic import BaseModel


class ValidationIssue(BaseModel):
    level: str
    field: str
    message: str


class ConfigValidation(BaseModel):
    valid: bool
    issues: list[ValidationIssue]
