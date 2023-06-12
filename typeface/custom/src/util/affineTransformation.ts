import { dtr } from './utils'
import Camera from '../class/Camera'
import { Coord } from '../type'

function affineWorldSize(p: Coord, size: Coord) {
    return {
        x: p.x * size.x,
        y: p.y * size.y,
        z: p.z * size.z
    }
}

function affineWorldRotateX(p: Coord, rotate: Coord) {
    return {
        x: p.x,
        y: p.y * Math.cos(dtr(rotate.x)) - p.z * Math.sin(dtr(rotate.x)),
        z: p.y * Math.sin(dtr(rotate.x)) + p.z * Math.cos(dtr(rotate.x))
    }
}

function affineWorldRotateY(p: Coord, rotate: Coord) {
    return {
        x: p.x * Math.cos(dtr(rotate.y)) + p.z * Math.sin(dtr(rotate.y)),
        y: p.y,
        z: -p.x * Math.sin(dtr(rotate.y)) + p.z * Math.cos(dtr(rotate.y))
    }
}

function affineWorldRotateZ(p: Coord, rotate: Coord) {
    return {
        x: p.x * Math.cos(dtr(rotate.z)) - p.y * Math.sin(dtr(rotate.z)),
        y: p.x * Math.sin(dtr(rotate.z)) + p.y * Math.cos(dtr(rotate.z)),
        z: p.z
    }
}

function affineWorldPosition(p: Coord, position: Coord) {
    return {
        x: p.x + position.x,
        y: p.y + position.y,
        z: p.z + position.z
    }
}

function affineViewPoint(p: Coord) {
    const camera = Camera.getInstance()
    return {
        x: p.x - camera.self.x,
        y: p.y - camera.self.y,
        z: p.z - camera.self.z
    }
}

function affineViewX(p: Coord) {
    const camera = Camera.getInstance()
    return {
        x: p.x,
        y: p.y * Math.cos(dtr(camera.rotate.x)) - p.z * Math.sin(dtr(camera.rotate.x)),
        z: p.y * Math.sin(dtr(camera.rotate.x)) + p.z * Math.cos(dtr(camera.rotate.x))
    }
}

function affineViewY(p: Coord) {
    const camera = Camera.getInstance()
    return {
        x: p.x * Math.cos(dtr(camera.rotate.y)) + p.z * Math.sin(dtr(camera.rotate.y)),
        y: p.y,
        z: p.x * -Math.sin(dtr(camera.rotate.y)) + p.z * Math.cos(dtr(camera.rotate.y))
    }
}

function affineViewReset(p: Coord) {
    const camera = Camera.getInstance()
    return {
        x: p.x - camera.self.x,
        y: p.y - camera.self.y,
        z: p.z - camera.self.z
    }
}

function affineViewRighthandedReversal(p: Coord) {
    return {
        x: p.x,
        y: -p.y,
        z: p.z,
    }
}

function affinePerspective(p: Coord) {
    const camera = Camera.getInstance()
    return {
        x: p.x * ((camera.focus - camera.self.z) / ((camera.focus - camera.self.z) - p.z)) * camera.zoom,
        y: p.y * ((camera.focus - camera.self.z) / ((camera.focus - camera.self.z) - p.z)) * camera.zoom,
        z: p.z * ((camera.focus - camera.self.z) / ((camera.focus - camera.self.z) - p.z)) * camera.zoom,
        p: ((camera.focus - camera.self.z) / ((camera.focus - camera.self.z) - p.z)) * camera.zoom,
    }
}
function affineDisplay(p: Coord, display: Coord) {
    return {
        x: p.x + display.x,
        y: p.y + display.y,
        z: p.z + display.z,
        p: p.p,
    }
}
function affineProcess(model: Coord, size: Coord, rotate: Coord, position: Coord, display: Coord) {
    let ret: Coord = affineWorldSize(model, size);
    ret = affineWorldRotateX(ret, rotate);
    ret = affineWorldRotateY(ret, rotate);
    ret = affineWorldRotateZ(ret, rotate);
    ret = affineWorldPosition(ret, position);
    ret = affineViewPoint(ret);
    ret = affineViewX(ret);
    ret = affineViewY(ret);
    ret = affineViewReset(ret);
    ret = affineViewRighthandedReversal(ret);
    ret = affinePerspective(ret);
    ret = affineDisplay(ret, display);
    return ret;
}

export {
    affineWorldSize,
    affineWorldRotateX,
    affineWorldRotateY,
    affineWorldRotateZ,
    affineWorldPosition,
    affineViewPoint,
    affineViewX,
    affineViewY,
    affineViewReset,
    affineViewRighthandedReversal,
    affinePerspective,
    affineDisplay,
    affineProcess,
}