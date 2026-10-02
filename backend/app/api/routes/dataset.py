from __future__ import annotations

import re

import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse, Response

from app.dataset import exporter
from app.store import store

router = APIRouter(prefix="/api/dataset", tags=["dataset"])


def _df() -> pd.DataFrame:
    if store.df is None:
        raise HTTPException(404, detail="No dataset yet. Run a simulation first.")
    return store.df


@router.get("/table")
def table(page: int = Query(1, ge=1), page_size: int = Query(25, ge=5, le=500),
          search: str = "", sort_by: str | None = None, sort_dir: str = Query("asc", pattern="^(asc|desc)$"),
          filter_col: str | None = None, filter_min: float | None = None,
          filter_max: float | None = None) -> JSONResponse:
    df = _df()
    view = df
    if search.strip():
        mask = view.astype(str).apply(lambda c: c.str.contains(search.strip(), case=False, regex=False)).any(axis=1)
        view = view[mask]
    if filter_col:
        if filter_col not in df.columns:
            raise HTTPException(422, detail=f"Unknown column: {filter_col}")
        if filter_min is not None:
            view = view[view[filter_col] >= filter_min]
        if filter_max is not None:
            view = view[view[filter_col] <= filter_max]
    if sort_by:
        if sort_by not in df.columns:
            raise HTTPException(422, detail=f"Unknown column: {sort_by}")
        view = view.sort_values(sort_by, ascending=sort_dir == "asc", kind="stable")
    total = len(view)
    pages = max(1, int(np.ceil(total / page_size)))
    page = min(page, pages)
    chunk = view.iloc[(page - 1) * page_size: page * page_size]
    return JSONResponse({
        "columns": list(df.columns), "rows": chunk.to_numpy().tolist(),
        "total_rows": int(len(df)), "filtered_rows": int(total),
        "page": page, "pages": pages, "page_size": page_size,
    })


@router.get("/stats")
def stats() -> JSONResponse:
    d = _df().describe().T
    d.index.name = "column"
    d = d.reset_index().rename(columns={"25%": "q25", "50%": "median", "75%": "q75"})
    return JSONResponse(d.round(6).to_dict(orient="records"))


@router.get("/validation")
def validation() -> JSONResponse:
    _df()
    return JSONResponse(store.validation)


def _slug() -> str:
    name = getattr(store.config, "name", "vlp-dataset")
    return re.sub(r"[^a-zA-Z0-9]+", "-", name).strip("-").lower() or "vlp-dataset"


@router.get("/export/{fmt}")
def export(fmt: str) -> Response:
    df = _df()
    slug = _slug()
    if fmt == "csv":
        body, mime, ext = exporter.to_csv_bytes(df), "text/csv", "csv"
    elif fmt == "json":
        body, mime, ext = exporter.to_json_bytes(df), "application/json", "json"
    elif fmt == "xlsx":
        body = exporter.to_xlsx_bytes(df, store.config)
        mime, ext = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx"
    elif fmt == "config":
        body, mime, ext = exporter.config_json_bytes(store.config), "application/json", "config.json"
    else:
        raise HTTPException(404, detail=f"Unsupported export format: {fmt}")
    return Response(body, media_type=mime,
                    headers={"Content-Disposition": f'attachment; filename="{slug}.{ext}"'})
