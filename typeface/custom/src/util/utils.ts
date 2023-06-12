export function dtr(v: number) {
    { return v * Math.PI / 180; };
}

export function polarToRectangle(dX: number, dY: number, radius: number) {
    const x = Math.sin(dtr(dX)) * Math.cos(dtr(dY)) * radius;
    const y = Math.sin(dtr(dX)) * Math.sin(dtr(dY)) * radius;
    const z = Math.cos(dtr(dX)) * radius;
    return { x: y, y: z, z: x };
};

export function rectangleToPolar(x: number, y: number, z: number) {
    const xD = x === 0 ? 0.001 : x
    const yD = y === 0 ? 0.001 : y
    const zD = z === 0 ? 0.001 : z

    const radius = Math.sqrt(xD * xD + yD * yD + zD * zD);
    const theta = Math.atan(zD / Math.sqrt(xD * xD + yD * yD));
    const phi = Math.atan(yD / xD);
    return { x: theta * (180 / Math.PI), y: phi * (180 / Math.PI), r: radius };
};