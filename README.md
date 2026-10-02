# VLP Lab

### Visible Light Positioning Simulation & Dataset Generation Platform

VLP Lab is a configurable simulation platform for **Visible Light Positioning (VLP)** research, experimentation, and dataset generation.

It provides an interactive virtual laboratory where users can configure a VLP environment, define LED and receiver parameters, introduce optical noise, observe signal behaviour, run simulations, analyse generated data, and export datasets for further research or machine-learning experiments.

The platform separates the **simulation/physics engine** from the interactive frontend, allowing the underlying VLP model to be used independently from the visualization layer.

---

## Overview

Visible Light Positioning uses modulated visible light from LED luminaires to estimate the position of a receiver.

VLP Lab simulates this process inside a configurable virtual environment:

```text
Environment Configuration
          │
          ▼
     LED Sources
          │
          ▼
   Receiver Movement
          │
          ▼
 Distance Calculation
          │
          ▼
 Optical Signal Model
          │
          ▼
    Noise Generation
          │
          ▼
   RSS Computation
          │
          ▼
 Time-Dependent Signals
          │
          ▼
 Dataset Generation
          │
          ▼
 Analysis & Export
```

The generated datasets can be used for **VLP research, signal analysis, algorithm development, and machine-learning experimentation**.

---

## Key Features

### Virtual VLP Laboratory

* Interactive 3D simulation environment
* Multiple fixed LED transmitters
* Configurable receiver
* Receiver movement and trajectory visualization
* Adjustable room dimensions
* Interactive camera controls
* LED radiation/cone visualization
* Optical signal/ray visualization
* Real-time simulation timeline

### Configurable Simulation

Users can configure parameters such as:

* Room dimensions
* LED positions
* LED optical parameters
* Receiver position
* Receiver movement
* Field of view
* Optical characteristics
* Simulation duration
* Sampling interval
* Noise configuration
* Signal conditions

### Noise Simulation

VLP Lab supports configurable optical noise sources that can affect the simulated received signal.

Noise experiments can be configured and compared across different conditions to study their effect on RSS measurements and generated datasets.

### RSS Analysis

The platform provides analysis tools for:

* RSS signals from individual LEDs
* Multi-LED RSS behaviour
* Signal changes over time
* Noise behaviour
* Receiver trajectories
* Dataset statistics

### Dataset Generation

Generate structured datasets directly from the configured simulation.

Generated datasets can contain information such as:

```text
Time
Receiver Position
LED Distances
Noise Parameters
Noise Conditions
RSS Measurements
Simulation Parameters
```

The dataset structure is designed to make generated data easy to reuse in external research and machine-learning workflows.

### Experiment Management

Experiments can be:

* Configured
* Saved
* Loaded
* Compared
* Reproduced

Experiment configurations are stored as JSON files, allowing simulation setups to be preserved and reused.

### Dataset Explorer

The dataset explorer provides tools for:

* Inspecting generated records
* Filtering data
* Viewing dataset statistics
* Examining signal values
* Exploring simulation conditions

### Export

Generated datasets can be exported for use with external tools and workflows such as:

* Python
* Pandas
* MATLAB
* R
* Jupyter Notebook
* Google Colab
* Machine-learning pipelines

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* React Three Fiber
* Three.js

### Backend

* Python
* FastAPI
* NumPy
* Pandas
* Pydantic

### Testing

* Pytest
* HTTPX

---

## System Architecture

```text
┌─────────────────────────────────────────────┐
│                  VLP LAB                    │
├──────────────────────┬──────────────────────┤
│      Frontend        │       Backend        │
│                      │                      │
│ React + TypeScript   │      FastAPI         │
│ React Three Fiber    │                      │
│ Three.js             │   Simulation Engine  │
│                      │          │           │
│ Virtual Laboratory   │          ▼           │
│ Configuration UI     │   Physics / Models   │
│ Analysis Dashboard   │          │           │
│ Dataset Explorer     │          ▼           │
│ Experiment Manager   │   Dataset Generator  │
└──────────┬───────────┴──────────┬───────────┘
           │                      │
           └────── REST API ──────┘
```

The frontend is responsible for **interaction, visualization, configuration, and analysis**.

The backend is responsible for **simulation logic, calculations, dataset generation, validation, and data processing**.

---

## Project Structure

```text
vlp-dataset-generator/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── dataset/
│   │   ├── experiments/
│   │   ├── schemas/
│   │   ├── simulator/
│   │   ├── main.py
│   │   └── store.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── analysis/
│   │   │   ├── configuration/
│   │   │   ├── dashboard/
│   │   │   ├── dataset/
│   │   │   ├── experiments/
│   │   │   ├── layout/
│   │   │   ├── simulation/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── package.json
│
├── configs/
│   └── experiments/
│
├── tests/
│
├── LICENSE
├── README.md
└── package.json
```

---

## Requirements

* Python 3.10+
* Node.js 18+
* npm
* Git

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Pawarasithumina/vlp-dataset-generator.git
cd vlp-dataset-generator
```

### Backend

Create and activate the Python environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r backend/requirements.txt
```

Start the FastAPI server:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

The API will be available at:

```text
http://localhost:8000
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the application:

```text
http://localhost:5173
```

---

## Running the Complete Platform

Two processes are required during development:

```text
Frontend
http://localhost:5173
       │
       │ REST API
       ▼
Backend
http://localhost:8000
       │
       ▼
VLP Simulation Engine
       │
       ▼
Dataset Generator
```

If the root development script is configured, both services can also be started with:

```bash
npm run dev
```

---

## Testing

Run the backend tests from the project root:

```bash
pytest tests
```

Or:

```bash
python -m pytest tests
```

---

## Typical Workflow

```text
1. Configure Environment
        ↓
2. Configure LEDs
        ↓
3. Configure Receiver
        ↓
4. Configure Optical Parameters
        ↓
5. Configure Noise
        ↓
6. Run Simulation
        ↓
7. Inspect Virtual Environment
        ↓
8. Analyse RSS / Noise / Trajectory
        ↓
9. Generate Dataset
        ↓
10. Validate Dataset
        ↓
11. Export Dataset
        ↓
12. Reuse for Research / Analysis
```

---

## Research & Educational Use

VLP Lab is designed as a research and educational tool for exploring concepts including:

* Visible Light Positioning
* Received Signal Strength (RSS)
* Optical wireless communication
* LED-based positioning
* Receiver trajectories
* Optical noise
* Signal modelling
* Synthetic dataset generation
* Experimental reproducibility

The platform is intended to make it easier to create controlled and repeatable VLP simulation experiments without requiring physical positioning hardware.

---

## Reproducible Experiments

Experiment configurations are stored in:

```text
configs/experiments/
```

Configurations can be saved as JSON and reused to reproduce simulation conditions.

This allows researchers to maintain consistent experimental parameters across multiple dataset-generation runs.

---

## Dataset Generation Philosophy

VLP Lab focuses on **controlled synthetic data generation**.

Instead of relying exclusively on manually collected physical measurements, users can define simulation conditions and generate datasets under controlled combinations of:

* Environment parameters
* LED configurations
* Receiver trajectories
* Optical parameters
* Noise conditions
* Sampling parameters

This makes the platform suitable for experimentation where controlled variations of simulation parameters are required.

---

## Current Scope

VLP Lab currently focuses on:

* VLP simulation
* Configurable LED and receiver environments
* RSS-based signal generation
* Optical noise simulation
* Time-dependent simulation data
* Dataset generation
* Dataset inspection
* Experiment management
* Interactive 3D visualization

Machine-learning model training and position-estimation models are **outside the core scope of the platform**.

Generated datasets can, however, be exported and used with external machine-learning workflows.

---

## Future Development

Potential future improvements include:

* Additional optical channel models
* More configurable noise models
* Advanced receiver trajectories
* Additional dataset formats
* Experiment comparison tools
* Batch experiment generation
* Enhanced 3D visualization
* Simulation replay
* Dataset versioning
* Additional validation tools
* Research-oriented experiment reporting

---

## License

This project is licensed under the terms specified in the [`LICENSE`](LICENSE) file.

---


## Project Status

**Active Development**

VLP Lab is an evolving research and educational platform for configurable VLP simulation and synthetic dataset generation.
