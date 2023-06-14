const POINTER = {
  stroke: "STROKE",
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

const drawingCornerBox = (x, y, width, height, path) => {
  const smallTl = new Path2D();
  smallTl.rect(x - 10, y - 10, 10, 10);
  canvasContext.lineWidth = 3;
  canvasContext.strokeStyle = "blue";
  path.addPath(smallTl);
  canvasContext.stroke(smallTl);
  const smallTr = new Path2D();
  smallTr.rect(x + width, y - 10, 10, 10);
  path.addPath(smallTr);
  canvasContext.stroke(smallTr);
  const smallBl = new Path2D();
  smallBl.rect(x - 10, y + height, 10, 10);
  path.addPath(smallBl);
  canvasContext.stroke(smallBl);
  const smallBr = new Path2D();
  smallBr.rect(x + width, y + height, 10, 10);
  path.addPath(smallBr);
  canvasContext.stroke(smallBr);
};

const init = () => {
  container = document.getElementById("container");
  canvas = document.createElement("canvas");
  canvas.width = "800";
  canvas.height = "800";
  canvasContext = canvas.getContext("2d");

  canvasBackground = new Path2D();
  canvasBackground.rect(0, 0, 800, 800);
  canvasContext.fillStyle = "rgba(0,0,0,0)";
  canvasContext.fill(canvasBackground);

  const box = new Path2D();
  box.rect(20, 20, 100, 100);
  canvasContext.lineWidth = 10;
  canvasContext.strokeStyle = "red";
  canvasContext.stroke(box);

  drawingCornerBox(20, 20, 100, 100, box);

  objects = {
    object: box,
    x: 20,
    y: 20,
    width: 100,
    height: 100,
  };

  container.append(canvas);
};

// Drag, Resizing Event
const dragging = (diffX, diffY) => {
  const context = canvas.getContext("2d");
  const { x, y, width, height } = objects;
  const box = new Path2D();
  const calX = diffX + x;
  const calY = diffY + y;
  box.rect(calX, calY, width, height);
  context.strokeStyle = "red";
  context.lineWidth = 10;
  objects = {
    object: box,
    x: calX,
    y: calY,
    width,
    height,
  };

  context.clearRect(0, 0, 800, 800);
  context.stroke(box);
  drawingCornerBox(calX, calY, width, height, box);
};
const resizing = (diffX, diffY) => {
  if (grabbedCoord === GRAB_COORD.tc) {
    topResizing(diffY);
  } else if (grabbedCoord === GRAB_COORD.tr) {
    topRightResizing(diffX, diffY);
  } else if (grabbedCoord === GRAB_COORD.tl) {
    topLeftResizing(diffX, diffY);
  } else if (grabbedCoord === GRAB_COORD.bc) {
    bottomResizing(diffY);
  } else if (grabbedCoord === GRAB_COORD.br) {
    bottomRightResizing(diffX, diffY);
  } else if (grabbedCoord === GRAB_COORD.bl) {
    bottomLeftResizing(diffX, diffY);
  } else if (grabbedCoord === GRAB_COORD.rc) {
    rightResizing(diffX);
  } else if (grabbedCoord === GRAB_COORD.lc) {
    leftResizing(diffX);
  }
};

// 8 way Resizing
const topResizing = (diffY) => {
  const { x, y, width, height } = objects;
  const box = new Path2D();
  const calHeight = height - diffY;

  box.rect(x, y + diffY, width, calHeight);
  canvasContext.strokeStyle = "red";
  canvasContext.lineWidth = 10;

  objects = {
    object: box,
    x: x,
    y: y + diffY,
    width: width,
    height: calHeight,
  };
  canvasContext.clearRect(0, 0, 800, 800);
  canvasContext.stroke(box);
  drawingCornerBox(x, y, width, calHeight, box);
};
const bottomResizing = (diffY) => {
  const { x, y, width, height } = objects;
  const box = new Path2D();
  const calHeight = diffY + height;

  box.rect(x, y, width, calHeight);
  canvasContext.strokeStyle = "red";
  canvasContext.lineWidth = 10;

  objects = {
    object: box,
    x: x,
    y: y,
    width: width,
    height: calHeight,
  };
  canvasContext.clearRect(0, 0, 800, 800);
  canvasContext.stroke(box);
  drawingCornerBox(x, y, width, calHeight, box);
};
const rightResizing = (diffX) => {
  const { x, y, width, height } = objects;
  const box = new Path2D();
  const calWidth = diffX + width;

  box.rect(x, y, calWidth, height);
  canvasContext.strokeStyle = "red";
  canvasContext.lineWidth = 10;

  objects = {
    object: box,
    x: x,
    y: y,
    width: calWidth,
    height,
  };
  canvasContext.clearRect(0, 0, 800, 800);
  canvasContext.stroke(box);
  drawingCornerBox(x, y, calWidth, height, box);
};
const leftResizing = (diffX) => {
  const { x, y, width, height } = objects;
  const box = new Path2D();
  const calWidth = -diffX + width;

  box.rect(x + diffX, y, calWidth, height);
  canvasContext.strokeStyle = "red";
  canvasContext.lineWidth = 10;

  objects = {
    object: box,
    x: x + diffX,
    y: y,
    width: calWidth,
    height,
  };
  canvasContext.clearRect(0, 0, 800, 800);
  canvasContext.stroke(box);
  drawingCornerBox(x + diffX, y, calWidth, height, box);
};
const topRightResizing = (diffX, diffY) => {
  const { x, y, width, height } = objects;

  const box = new Path2D();
  const calWidth = width + diffX;
  const calHeight = height - diffY;

  box.rect(x, y + diffY, calWidth, calHeight);

  canvasContext.strokeStyle = "red";
  canvasContext.lineWidth = 10;

  objects = {
    object: box,
    x: x,
    y: y + diffY,
    width: calWidth,
    height: calHeight,
  };

  canvasContext.clearRect(0, 0, 800, 800);
  canvasContext.stroke(box);
  drawingCornerBox(x, y + diffY, calWidth, calHeight, box);
};
const topLeftResizing = (diffX, diffY) => {
  const { x, y, width, height } = objects;

  const box = new Path2D();
  const calWidth = width - diffX;
  const calHeight = height - diffY;

  box.rect(x + diffX, y + diffY, calWidth, calHeight);

  canvasContext.strokeStyle = "red";
  canvasContext.lineWidth = 10;

  objects = {
    object: box,
    x: x + diffX,
    y: y + diffY,
    width: calWidth,
    height: calHeight,
  };

  canvasContext.clearRect(0, 0, 800, 800);
  canvasContext.stroke(box);
  drawingCornerBox(x + diffX, y + diffY, calWidth, calHeight, box);
};
const bottomRightResizing = (diffX, diffY) => {
  const { x, y, width, height } = objects;

  const box = new Path2D();
  const calWidth = width + diffX;
  const calHeight = height + diffY;

  box.rect(x, y, calWidth, calHeight);

  canvasContext.strokeStyle = "red";
  canvasContext.lineWidth = 10;

  objects = {
    object: box,
    x: x,
    y: y,
    width: calWidth,
    height: calHeight,
  };

  canvasContext.clearRect(0, 0, 800, 800);
  canvasContext.stroke(box);
  drawingCornerBox(x + diffX, y + diffY, calWidth, calHeight, box);
};
const bottomLeftResizing = (diffX, diffY) => {
  const { x, y, width, height } = objects;

  const box = new Path2D();
  const calWidth = width - diffX;
  const calHeight = height + diffY;

  box.rect(x + diffX, y, calWidth, calHeight);

  canvasContext.strokeStyle = "red";
  canvasContext.lineWidth = 10;

  objects = {
    object: box,
    x: x + diffX,
    y: y,
    width: calWidth,
    height: calHeight,
  };

  canvasContext.clearRect(0, 0, 800, 800);
  canvasContext.stroke(box);
  drawingCornerBox(x + diffX, y, calWidth, calHeight, box);
};

// Mouse Cursor
const changeMouseCursor = (x, y) => {
  const isPathHover = canvasContext.isPointInPath(objects.object, x, y);
  const isStrokeHover = canvasContext.isPointInStroke(objects.object, x, y);

  if (isStrokeHover) {
    canvas.style.cursor = "crosshair";
  } else if (isPathHover) {
    canvas.style.cursor = "pointer";
  } else {
    canvas.style.cursor = "default";
  }
};

// mouse event
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

  const { x, y, width, height } = objects;
  const mX = event.offsetX;
  const mY = event.offsetY;
  if (isStrokeHover) {
    mouseCursor.position = POINTER.stroke;
    if (x + 5 < mX && x + width - 5 > mX && y + 5 > mY) {
      grabbedCoord = GRAB_COORD.tc;
    } else if (x + 5 < mX && x + width - 5 > mX && y - 5 + height < mY) {
      grabbedCoord = GRAB_COORD.bc;
    } else if (x + width - 5 < mX && y < mY && y + height > mY) {
      grabbedCoord = GRAB_COORD.rc;
    } else if (x + 5 > mX && y < mY && y + height > mY) {
      grabbedCoord = GRAB_COORD.lc;
    } else if (x + width - 5 <= mX && y + 5 >= mY) {
      grabbedCoord = GRAB_COORD.tr;
    } else if (x + 5 >= mX && y + 5 >= mY) {
      grabbedCoord = GRAB_COORD.tl;
    } else if (x + width - 5 <= mX && y + height - 5 <= mY) {
      grabbedCoord = GRAB_COORD.br;
    } else if (x + 5 >= mX && y + height - 5 <= mY) {
      grabbedCoord = GRAB_COORD.bl;
    }
  } else if (isPathHover) {
    mouseCursor.position = POINTER.path;
  } else {
    mouseCursor.position = POINTER.default;
  }
};
const onMouseMove = (event) => {
  changeMouseCursor(event.offsetX, event.offsetY);
  const diffX = event.offsetX - mouseCursor.x;
  const diffY = event.offsetY - mouseCursor.y;
  mouseCursor.x = event.offsetX;
  mouseCursor.y = event.offsetY;

  if (mouseCursor.position === POINTER.stroke) {
    resizing(diffX, diffY);
  } else if (mouseCursor.position === POINTER.path) {
    dragging(diffX, diffY);
  }
};
const onMouseUp = () => {
  mouseCursor.position = POINTER.default;
  grabbedCoord = GRAB_COORD.default;
};

init();

canvas.addEventListener("mousedown", onMouseDown);

window.addEventListener("mouseup", onMouseUp);

window.addEventListener("mousemove", onMouseMove);

function scale() {
  canvasContext.imageSmoothingEnabled = false;
  canvasContext.scale(3, 3);
}
