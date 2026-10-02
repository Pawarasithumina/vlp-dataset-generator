/** Simulation space is Z-up; Three.js is Y-up. Right-handed mapping: (x, y, z) -> (x, z, -y). */
export type Vec3 = [number, number, number]
export const toThree = (x: number, y: number, z: number): Vec3 => [x, z, -y]
