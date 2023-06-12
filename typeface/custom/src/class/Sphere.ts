import CONSTANT from "../constant";
import Vertex3d from './Vertex3d'
import { polarToRectangle } from '../util/utils'
import { Coord, Degree } from "../type";

type StringKeyObject = {
    [key: string]: any;
};


export default class Sphere {
    flag = true;
    type = "_";
    center: Coord = { x: 0, y: 0, z: 0 };
    radius = 0;
    degree: Array<Degree> = new Array();
    freeDegreeSpeed: Array<Degree> = new Array();
    charsMap: StringKeyObject = new Object();
    targetCenter
    targetRadius
    particleNum
    veticies: Array<Vertex3d> = new Array()

    constructor({ particleNum, center, radius }: { particleNum: number, center: Coord, radius: number }) {
        this.targetCenter = center;
        this.targetRadius = radius;
        this.particleNum = particleNum;

        for (let i = 0; i < this.particleNum; i++) {
            this.degree[i] = { theta: 0, phi: 0 };
            this.freeDegreeSpeed[i] = { theta: 1 * Math.random() - 0.5, phi: 1 * Math.random() - 0.5 };
        };
        for (const char in CONSTANT.CHARS) {
            const canvasElement = document.getElementById(char) as HTMLCanvasElement
            const buffer = canvasElement.getContext("2d")!.getImageData(0, 0, 100, 100).data

            this.charsMap[char] = new Array();

            const redo = () => {
                const theta = Math.floor(Math.random() * 100);
                const phi = Math.floor(Math.random() * 100);

                if (buffer[(theta * 400 + (phi * 4))] == 0) {
                    this.charsMap[char].push(
                        {
                            theta: theta - 50 + 360 * Math.round(Math.random() * 2) - 1,
                            phi: phi - 50 + 360 * Math.round(Math.random() * 2) - 1
                        }
                    );
                } else redo();
            }

            for (let i = 0; i < this.particleNum; i++) {
                redo();
            };
            this.charsMap["@"] = new Array();
            for (let i = 0; i < this.particleNum; i++) {
                this.charsMap["@"][i] = { theta: 360 * Math.random(), phi: 360 * Math.random() };
            };
            this.charsMap["_"] = new Array();
            for (let i = 0; i < this.particleNum; i++) {
                this.charsMap["_"][i] = { theta: 0, phi: 0 };
            };

            this.veticies = new Array();
            for (let i = 0; i < this.particleNum; i++) {
                this.veticies[i] = new Vertex3d();
            };
        };
    }
    update(vibrateFlag: boolean) {
        for (let i = 0; i < this.charsMap[this.type].length; i++) {
            if (this.degree[i].theta >= 30 && this.degree[i].phi >= 30) {
                this.flag = true;
                break;
            } else {
                this.flag = false;
            };
        };
        this.radius = this.radius + (this.targetRadius - this.radius) / 8;
        this.center.x = this.center.x + (this.targetCenter.x - this.center.x) / 8;
        this.center.y = this.center.y + (this.targetCenter.y - this.center.y) / 8;
        this.center.z = this.center.z + (this.targetCenter.z - this.center.z) / 8;
        for (let i = 0; i < this.charsMap[this.type].length; i++) {
            if (this.type === "@") {
                this.charsMap[this.type][i].theta += this.freeDegreeSpeed[i].theta;
                this.charsMap[this.type][i].phi += this.freeDegreeSpeed[i].phi;
            };
            this.degree[i].theta = this.degree[i].theta + (this.charsMap[this.type][i].theta - this.degree[i].theta) / (4 + 20 * Math.random());
            this.degree[i].phi = this.degree[i].phi + (this.charsMap[this.type][i].phi - this.degree[i].phi) / (4 + 20 * Math.random());
            if (vibrateFlag == true) {
                var getPosition = polarToRectangle(this.degree[i].theta + 90, this.degree[i].phi, this.radius + Math.random() * 10);
            } else {
                var getPosition = polarToRectangle(this.degree[i].theta + 90, this.degree[i].phi, this.radius);
            };
            this.veticies[i].affineIn.vertex = {
                x: getPosition.x,
                y: getPosition.y,
                z: getPosition.z
            };
            this.center.x
            this.veticies[i].affineIn.position = {
                x: this.center.x,
                y: this.center.y,
                z: this.center.z
            };
            this.veticies[i].vertexUpdate();
        };
    }
    draw(ctx: CanvasRenderingContext2D) {
        if (this.flag == true) {
            ctx.beginPath();
            for (var i = 0; i < this.veticies.length; i++) {
                for (var j = i; j < this.veticies.length; j++) {

                    var distance =
                        (this.veticies[i].affineOut.x - this.veticies[j].affineOut.x) * (this.veticies[i].affineOut.x - this.veticies[j].affineOut.x) +
                        (this.veticies[i].affineOut.y - this.veticies[j].affineOut.y) * (this.veticies[i].affineOut.y - this.veticies[j].affineOut.y);

                    if (distance <= this.radius * 3) {
                        ctx.moveTo(
                            this.veticies[i].affineOut.x,
                            this.veticies[i].affineOut.y
                        );
                        ctx.lineTo(
                            this.veticies[j].affineOut.x,
                            this.veticies[j].affineOut.y
                        );
                    };
                };
            };
            ctx.closePath();
            ctx.stroke();
        };
    }
}