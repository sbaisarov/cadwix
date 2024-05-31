let canvas = new fabric.Canvas('canvas2D');

// set size 100 x 100 mm
canvas.setWidth(378);
canvas.setHeight(378);

canvas.freeDrawingBrush.width = 5;
canvas.freeDrawingBrush.color = 'black';

let mmToPixels = 3.78; // 1mm = 3.78px
let delimeter = 10 * mmToPixels; // 10mm


let isCutting = false;
let isPanning = false;
let isDashing = false;

let facilities = []; // store all the drawing objects

let axisLines = [];
let axisLine = null;

let line = null;
