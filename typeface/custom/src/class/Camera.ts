import { Coord } from "../type";

export default class Camera {
    private static cameraInstance: Camera
    focus = 400;
    self: Coord = {
        x: 0,
        y: 0,
        z: 0
    };
    rotate: Coord = {
        x: 0,
        y: 0,
        z: 0
    };
    up: Coord = {
        x: 0,
        y: 0,
        z: 0
    };
    zoom = 1;
    display: Coord = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        z: 0
    }
    private constructor() { }

    public static getInstance() {
        if (!Camera.cameraInstance) {
            Camera.cameraInstance = new Camera();
        }

        return Camera.cameraInstance;
    }

    updateInstanceData() {

    }
}