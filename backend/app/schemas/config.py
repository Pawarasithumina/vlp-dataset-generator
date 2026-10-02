"""Experiment configuration schema (single source of truth for all parameters)."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class RoomConfig(BaseModel):
    width: float = Field(5.0, ge=1, le=50, description="Room width along X [m]")
    length: float = Field(5.0, ge=1, le=50, description="Room length along Y [m]")
    height: float = Field(3.0, ge=1, le=15, description="Room height along Z [m]")


class LEDConfig(BaseModel):
    count: int = Field(4, ge=1, le=64)
    placement: Literal["grid", "ring", "random"] = "grid"
    power: float = Field(3.0, gt=0, le=100, description="Transmit optical power per LED [W]")
    half_angle: float = Field(60.0, ge=5, le=85, description="Half-power semi-angle [deg]")


class ReceiverConfig(BaseModel):
    movement: Literal["static", "linear", "circular", "random_walk"] = "circular"
    x: float = Field(2.5, description="Start X (circle centre for circular) [m]")
    y: float = Field(2.5, description="Start Y (circle centre for circular) [m]")
    z: float = Field(0.8, ge=0, description="Receiver height [m]")
    speed: float = Field(0.5, ge=0, le=10, description="Receiver speed [m/s]")


class NoiseConfig(BaseModel):
    enabled: bool = True
    count: int = Field(2, ge=0, le=16)
    placement: Literal["even", "random", "corners"] = "even"
    type: Literal["gaussian", "sinusoidal", "impulsive", "mixed"] = "mixed"
    intensity: float = Field(2.0, ge=0, le=100, description="RMS amplitude at 1 m [uW]")
    frequency: float = Field(5.0, gt=0, le=1000, description="Tone / cut-off / event rate [Hz]")


class OpticalConfig(BaseModel):
    receiver_area: float = Field(1.0, gt=0, le=100, description="Photodiode area [cm^2]")
    filter_gain: float = Field(1.0, gt=0, le=1, description="Optical filter transmittance")
    concentrator_gain: float = Field(1.0, gt=0, le=20, description="Concentrator gain")
    fov: float = Field(60.0, ge=5, le=90, description="Receiver field of view (semi-angle) [deg]")


class SimulationConfig(BaseModel):
    samples: int = Field(500, ge=10, le=20000)
    time_step: float = Field(0.02, gt=0, le=1, description="Sampling interval [s]")


class ExperimentConfig(BaseModel):
    name: str = Field("Untitled experiment", min_length=1, max_length=80)
    description: str = Field("", max_length=500)
    seed: int = Field(42, ge=0, le=2**31 - 1)
    room: RoomConfig = RoomConfig()
    led: LEDConfig = LEDConfig()
    receiver: ReceiverConfig = ReceiverConfig()
    noise: NoiseConfig = NoiseConfig()
    optical: OpticalConfig = OpticalConfig()
    simulation: SimulationConfig = SimulationConfig()

    def semantic_issues(self) -> list[dict]:
        """Cross-field checks that single-field constraints cannot express."""
        out: list[dict] = []

        def add(level: str, field: str, message: str) -> None:
            out.append({"level": level, "field": field, "message": message})

        r, rc = self.room, self.receiver
        if not 0 <= rc.x <= r.width:
            add("error", "receiver.x", f"X must be inside the room (0 to {r.width} m).")
        if not 0 <= rc.y <= r.length:
            add("error", "receiver.y", f"Y must be inside the room (0 to {r.length} m).")
        if rc.z >= r.height:
            add("error", "receiver.z", f"Receiver height must be below the ceiling ({r.height} m).")

        nyquist = 0.5 / self.simulation.time_step
        n = self.noise
        if n.enabled and n.count > 0 and n.type != "impulsive" and n.frequency >= nyquist:
            add("error", "noise.frequency",
                f"Noise frequency must be below the Nyquist limit ({nyquist:.1f} Hz) "
                "for the chosen time step. Increase the sampling rate or lower the frequency.")
        if self.led.count > 36:
            add("warning", "led.count", "More than 36 LEDs makes the 3D view crowded; consider hiding cones.")
        if rc.movement == "static" and rc.speed > 0:
            add("warning", "receiver.speed", "Speed is ignored for a static receiver.")
        return out
