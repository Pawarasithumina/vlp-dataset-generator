from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import configuration, dataset, experiments, simulation

app = FastAPI(title="VLP Lab API", version="1.0.0",
              description="Visible Light Positioning simulation and dataset generation.")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"], allow_headers=["*"], expose_headers=["Content-Disposition"],
)
for r in (configuration.router, simulation.router, dataset.router, experiments.router):
    app.include_router(r)


@app.get("/api/health", tags=["system"])
def health() -> dict:
    return {"status": "ok", "service": "vlp-lab", "version": app.version}
