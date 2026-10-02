import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402

client = TestClient(app)


def test_health():
    assert client.get("/api/health").json()["status"] == "ok"


def test_run_and_dataset():
    cfg = client.get("/api/configuration/default").json()
    r = client.post("/api/simulation/run", json=cfg)
    assert r.status_code == 200
    d = r.json()
    assert len(d["rss"]) == cfg["led"]["count"] and len(d["rss"][0]) == cfg["simulation"]["samples"]
    assert d["validation"]["valid"]
    t = client.get("/api/dataset/table", params={"page_size": 10, "sort_by": "time_s", "sort_dir": "desc"}).json()
    assert len(t["rows"]) == 10 and t["total_rows"] == cfg["simulation"]["samples"]
    for fmt in ("csv", "xlsx", "json", "config"):
        assert client.get(f"/api/dataset/export/{fmt}").status_code == 200


def test_nyquist_error():
    cfg = client.get("/api/configuration/default").json()
    cfg["noise"]["frequency"] = 100
    assert client.post("/api/simulation/run", json=cfg).status_code == 422


def test_experiment_crud():
    e = client.post("/api/experiments", json={"name": "T1"}).json()
    assert client.patch(f"/api/experiments/{e['id']}/rename", json={"name": "T2"}).json()["name"] == "T2"
    dup = client.post(f"/api/experiments/{e['id']}/duplicate").json()
    assert dup["name"] == "T2 (copy)"
    for x in (e, dup):
        assert client.delete(f"/api/experiments/{x['id']}").status_code == 204
    assert len(client.get("/api/experiments/presets").json()) == 6
