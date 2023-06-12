export interface Coord {
    x: number;
    y: number;
    z: number;
    p?: number
}

export interface Camera {
    focus: number;
    self: Coord;
    rotate: Coord;
    up: Coord;
    zoom: number;
    display: Coord;
}

export interface Degree {
    theta: number;
    phi: number;
}

export interface BufferImages {
    [key: string]: HTMLImageElement
}

export interface StringObject {
    [key: string]: string
}
