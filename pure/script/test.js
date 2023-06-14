const POINTER = {
  stoke: "STROKE",
  path: "PATH",
  default: "DEFAULT",
};

const GRAB_COORD = {
  tc: "TC",
  tr: "TR",
  tl: "TL",
  bc: "BC",
  br: "BR",
  bl: "BL",
  rc: "RC",
  lc: "LC",
  none: "NONE",
};

let container;
let canvas;
let canvasContext;
let canvasBackground;
let isObjectClick = false;
let isStrokeClick = false;

let grabbedCoord = GRAB_COORD.none;

const mouseCursor = {
  x: 0,
  y: 0,
  position: POINTER.default,
};

let resizingPosition = null;

let objects = {};

function init() {
  container = document.getElementById("container");
  canvas = document.createElement("canvas");
  canvas.width = "800";
  canvas.height = "800";
  canvasContext = canvas.getContext("2d");

  canvasBackground = new Path2D();
  canvasBackground.rect(0, 0, 800, 800);
  canvasContext.fillStyle = "rgba(0,0,0,0)";
  canvasContext.fill(canvasBackground);

  const circle = new Path2D();
  circle.rect(20, 20, 100, 100);
  canvasContext.lineWidth = 16;
  canvasContext.strokeStyle = "red";
  canvasContext.stroke(circle);

  objects = {
    object: circle,
    x: 20,
    y: 20,
    width: 100,
    height: 100,
  };

  container.append(canvas);
}

function dragging(diffX, diffY) {
  const context = canvas.getContext("2d");

  const { x, y, width, height } = objects;

  const circle = new Path2D();

  const calX = diffX + x;
  const calY = diffY + y;

  circle.rect(calX, calY, width, height);

  context.fillStyle = "red";

  objects = {
    object: circle,
    x: calX,
    y: calY,
    width,
    height,
  };

  // context.clearRect(x - 10, y - 10, width + 20, height + 20);
  context.clearRect(0, 0, 800, 800);
  context.stroke(circle);
}

function resizing(diffX, diffY) {
  const context = canvas.getContext("2d");

  const { x, y, width, height } = objects;

  if (grabbedCoord === GRAB_COORD.tc) {
    topResizing(x, y, width, height, diffY);
  } else {
    const circle = new Path2D();

    const calWidth = diffX + width;
    const calHeight = diffY + height;

    circle.rect(x, y, calWidth, calHeight);

    context.fillStyle = "red";

    objects = {
      object: circle,
      x: x,
      y: y,
      width: calWidth,
      height: calHeight,
    };
    context.clearRect(0, 0, 800, 800);
    context.stroke(circle);
  }
}

const topResizing = (startX, startY, width, height, diffY) => {
  const circle = new Path2D();
  let calHeight;

  if (diffY > 0) {
    calHeight = -diffY + height;
  } else {
    calHeight = -diffY + height;
  }

  circle.rect(startX, startY + diffY, width, calHeight);
  canvasContext.fillStyle = "red";

  objects = {
    object: circle,
    x: startX,
    y: startY + diffY,
    width: width,
    height: calHeight,
  };
  canvasContext.clearRect(0, 0, 800, 800);
  canvasContext.stroke(circle);
};
const bottomResizing = () => {};
const rightResizing = () => {};
const leftmResizing = () => {};

function changeMouseCursor(x, y) {
  const isPathHover = canvasContext.isPointInPath(objects.object, x, y);
  const isStrokeHover = canvasContext.isPointInStroke(objects.object, x, y);

  if (isStrokeHover) {
    canvas.style.cursor = "crosshair";
  } else if (isPathHover) {
    canvas.style.cursor = "pointer";
  } else {
    canvas.style.cursor = "default";
  }
}

const onMouseDown = (event) => {
  const isPathHover = canvasContext.isPointInPath(
    objects.object,
    event.offsetX,
    event.offsetY
  );
  const isStrokeHover = canvasContext.isPointInStroke(
    objects.object,
    event.offsetX,
    event.offsetY
  );

  const { x, width } = objects;
  const mX = event.offsetX;

  if (isStrokeHover) {
    mouseCursor.position = POINTER.stoke;
    if (x < mX && x + width > mX) grabbedCoord = GRAB_COORD.tc;
  } else if (isPathHover) mouseCursor.position = POINTER.path;
  else mouseCursor.position = POINTER.default;
};

const onMouseMove = (event) => {
  changeMouseCursor(event.offsetX, event.offsetY);
  const diffX = event.offsetX - mouseCursor.x;
  const diffY = event.offsetY - mouseCursor.y;
  mouseCursor.x = event.offsetX;
  mouseCursor.y = event.offsetY;

  if (mouseCursor.position === POINTER.stoke) {
    resizing(diffX, diffY);
  } else if (mouseCursor.position === POINTER.path) {
    dragging(diffX, diffY);
  }
};

const onMouseUp = () => {
  mouseCursor.position = POINTER.default;
};

init();

canvas.addEventListener("mousedown", onMouseDown);

window.addEventListener("mouseup", onMouseUp);

window.addEventListener("mousemove", onMouseMove);
