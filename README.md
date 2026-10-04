# VLP Lab

Visible Light Positioning simulation and dataset generation platform.
React + React Three Fiber frontend, FastAPI + NumPy + Pandas backend. All physics runs in the backend.

## Requirements
- Python 3.10+
- Node.js 18+ (with npm)

## Run (two terminals)

**Terminal 1 — backend**
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate      macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API docs: http://localhost:8000/docs

**Terminal 2 — frontend**
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Tests
```bash
pip install -r backend/requirements.txt
pytest tests
```

Saved experiments are stored as JSON in `configs/experiments/`.

## Development

This project is under active development.
