import { Coord } from '../type';
import { affineProcess } from '../util/affineTransformation'
import Camera from './Camera';

interface AffineIn {
    vertex: Coord
    size: Coord
    rotate: Coord
    position: Coord
}

export default class Vertex3d {
    affineIn: AffineIn
    // TODO
    affineOut: any = null

    constructor(vertex = { x: 0, y: 0, z: 0 }, size = { x: 1, y: 1, z: 1 }, rotate = { x: 0, y: 0, z: 0 }, position = { x: 0, y: 0, z: 0 }) {
        this.affineIn = {
            vertex: vertex,
            size: size,
            rotate: rotate,
            position: position,
        }
    }

    vertexUpdate() {
        const camera = Camera.getInstance()
        this.affineOut = affineProcess(
            this.affineIn.vertex,
            this.affineIn.size,
            this.affineIn.rotate,
            this.affineIn.position,
            camera.display
        )
    }
}