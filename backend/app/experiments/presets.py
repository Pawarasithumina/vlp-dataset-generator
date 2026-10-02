from __future__ import annotations

from app.schemas.config import (ExperimentConfig, LEDConfig, NoiseConfig, OpticalConfig,
                                ReceiverConfig, RoomConfig, SimulationConfig)


def _preset(id: str, name: str, description: str, **kw) -> dict:
    cfg = ExperimentConfig(name=name, description=description, **kw)
    return {"id": id, "name": name, "description": description, "config": cfg.model_dump()}


def list_presets() -> list[dict]:
    return [
        _preset("basic-vlp", "Basic VLP",
                "Four ceiling LEDs and a receiver sliding along one axis. Noise disabled.",
                receiver=ReceiverConfig(movement="linear", x=0.5, y=2.5, z=0.8, speed=0.4),
                noise=NoiseConfig(enabled=False, count=0)),
        _preset("moving-receiver", "Moving Receiver",
                "Receiver circles the room centre with mild ambient noise.",
                receiver=ReceiverConfig(movement="circular", speed=0.8),
                noise=NoiseConfig(intensity=1.0),
                simulation=SimulationConfig(samples=800, time_step=0.02)),
        _preset("high-noise", "High Noise",
                "Six mixed noise sources at high intensity to stress positioning algorithms.",
                receiver=ReceiverConfig(movement="random_walk", speed=0.6),
                noise=NoiseConfig(count=6, intensity=8.0, frequency=8.0, type="mixed")),
        _preset("dense-led-grid", "Dense LED Grid",
                "Sixteen low-power LEDs in a regular grid for fine-grained positioning.",
                room=RoomConfig(width=6, length=6, height=3),
                led=LEDConfig(count=16, placement="grid", power=1.5, half_angle=45),
                receiver=ReceiverConfig(movement="circular", x=3, y=3, speed=0.7),
                noise=NoiseConfig(count=2, intensity=1.0)),
        _preset("large-room", "Large Room",
                "12 x 10 x 4 m hall with twelve LEDs and a wandering receiver.",
                room=RoomConfig(width=12, length=10, height=4),
                led=LEDConfig(count=12, placement="grid", power=6.0, half_angle=60),
                receiver=ReceiverConfig(movement="random_walk", x=6, y=5, z=1.0, speed=1.2),
                noise=NoiseConfig(count=4, intensity=2.0),
                simulation=SimulationConfig(samples=1000, time_step=0.02)),
        _preset("custom", "Custom Experiment",
                "Start from the default parameters and tune everything yourself."),
    ]
