import CONSTANT from "./constant";
import Camera from './class/Camera'
import Sphere from './class/Sphere'
import CloseValue from './class/CloseValue'
import { BufferImages } from "./type";

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
ctx!.strokeStyle = CONSTANT.WHITE_COLOR
const cameraInstance = Camera.getInstance()
const sphereNum = 20
let vibrateFlag = false;

window.onresize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cameraInstance.display.x = window.innerWidth / 2;
    cameraInstance.display.y = window.innerHeight / 2;
};

const sphereArr = new Array();

const setup = () => {
    for (let i = 0; i < sphereNum; i++) {
        sphereArr[i] = new Sphere({ radius: 100, particleNum: 250, center: { x: 70 * i - (sphereNum - 1) * 70 / 2, y: 0, z: 0 } });
    };
};
const update = () => {
    for (let i = 0; i < sphereNum; i++) {
        sphereArr[i].update(vibrateFlag);
    };
};
const draw = () => {
    for (let i = 0; i < sphereNum; i++) {
        sphereArr[i].draw(ctx);
    };
};

let charsLength = 0;
let charCounter = 0;

const bufferImages: BufferImages = {};
const bufferCanvases = {};

for (let i in CONSTANT.CHARS) {
    charsLength++;
    bufferImages[i] = new Image();
    bufferImages[i].src = CONSTANT.CHARS[i];
    bufferImages[i].onload = function () {
        charCounter++;
        if (charCounter === charsLength) {
            bufferDraw();
        };
    };
};

const bufferDraw = () => {
    for (let i in CONSTANT.CHARS) {
        const canvas = document.createElement("canvas");
        canvas.id = i;
        document.getElementById("buffer")!.appendChild(canvas);
        const charCanvas = document.getElementById(i) as HTMLCanvasElement
        charCanvas.getContext("2d")!.drawImage(
            bufferImages[i],
            0,
            0,
            100,
            100
        );
    };
    start();
};

const textChanger = (text: string, sphereRadius: number, sphereSpace: number, unitTime: number) => {
    let changeIncrement = 0;
    let charNum = text.length;
    let center = new Array();
    for (let i = 0; i < charNum; i++) {
        center[i] = { x: sphereSpace * i - sphereSpace * (charNum - 1) / 2, y: 0, z: 0 };
    };
    let changer = function () {
        setTimeout(function () {
            sphereArr[changeIncrement].type = text[changeIncrement];
            sphereArr[changeIncrement].targetCenter = center[changeIncrement];
            sphereArr[changeIncrement].targetRadius = sphereRadius;
            changeIncrement++;
            if (changeIncrement < charNum) {
                changer();
            };
        }, unitTime);
    };
    for (var i = charNum; i < sphereArr.length; i++) {
        sphereArr[i].type = "_";
    };
    changer();
};

const fullSet = () => {
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ__?!1234567890";
    let col = 10;
    let colUnit = 80;
    let rowUnit = 120;
    for (let i = 0; i < alpha.length; i++) {
        sphereArr[i].targetCenter = {
            x: (i % 10) * colUnit - (col - 1) * colUnit / 2,
            y: Math.floor(i / 10) * -rowUnit + 180,
            z: 0
        };
        sphereArr[i].type = alpha[i];
    };
};

const textSet = [
    { text: "WEBSPHERE", sphereRadius: 140, sphereSpace: 80, unitTime: 100, time: 1000 },
    { text: "THIS_IS", sphereRadius: 120, sphereSpace: 70, unitTime: 120, time: 4000 },
    { text: "EXPERIMENTAL", sphereRadius: 120, sphereSpace: 70, unitTime: 50, time: 2000 },
    { text: "TYPEFACE", sphereRadius: 120, sphereSpace: 70, unitTime: 100, time: 4000 },
    { text: "BASED_ON", sphereRadius: 100, sphereSpace: 60, unitTime: 100, time: 3000 },
    { text: "HELVETICA", sphereRadius: 140, sphereSpace: 80, unitTime: 100, time: 2000 },
    { text: "@@@@@@@@", sphereRadius: 60 + Math.random() * 60, sphereSpace: 200, unitTime: 100, time: 4000 },
    { text: "MOVABLE", sphereRadius: 120, sphereSpace: 70, unitTime: 100, time: 2000 },
    { text: "AND", sphereRadius: 100, sphereSpace: 60, unitTime: 150, time: 3500 },
    { text: "PROGRAMABLE", sphereRadius: 120, sphereSpace: 70, unitTime: 50, time: 2000 },
    { text: "!!!!!!!", sphereRadius: 100, sphereSpace: 60, unitTime: 100, time: 3500 },
    { text: "HACK_ME!", sphereRadius: 140, sphereSpace: 80, unitTime: 100, time: 2500 },
    { text: "@@@@@@@@", sphereRadius: 60 + Math.random() * 60, sphereSpace: 200, unitTime: 100, time: 4000 }
];

let textSetChangerIncrement = 0;
const textSetChanger = function () {
    setTimeout(function () {
        textChanger(
            textSet[textSetChangerIncrement].text,
            textSet[textSetChangerIncrement].sphereRadius,
            textSet[textSetChangerIncrement].sphereSpace,
            textSet[textSetChangerIncrement].unitTime
        );
        textSetChangerIncrement++;
        if (textSetChangerIncrement == textSet.length) {
            textSetChangerIncrement = 0;
        };
        textSetChanger();
    }, textSet[textSetChangerIncrement].time);
};
const vibrateCV = new CloseValue(200, 500);
const invertCV = new CloseValue(1000, 1200);


const start = () => {
    if (vibrateCV != undefined && invertCV != undefined) {
        setup();
        setInterval(() => {
            if (vibrateCV.execution() > 0.8) vibrateFlag = true;
            else vibrateFlag = false;

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            if (invertCV.execution() > 0.7) {
                ctx.fillStyle = CONSTANT.WHITE_COLOR;
                ctx.strokeStyle = CONSTANT.BLACK_COLOR;
            } else {
                ctx.fillStyle = CONSTANT.BLACK_COLOR
                ctx.strokeStyle = CONSTANT.WHITE_COLOR;
            };
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            update();
            draw();
        }, 1000 / 60);
        textSetChanger();
    }
};

document.body.onmousemove = function (e) {
    cameraInstance.rotate.x = e.pageY / window.innerHeight * 180 - 90;
    cameraInstance.rotate.y = e.pageX / window.innerWidth * 180 - 90;
    document.onmousedown = function () { cameraInstance.zoom = Math.random() * 1 + 1 };
    document.onmouseup = function () { cameraInstance.zoom = 1 };
};