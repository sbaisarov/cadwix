let canvas = new fabric.Canvas('canvas2D');

// set size 100 x 100 mm
canvas.setWidth(378);
canvas.setHeight(378);

canvas.freeDrawingBrush.width = 5;
canvas.freeDrawingBrush.color = 'black';
canvas.hoverCursor = 'default';
canvas.selectionColor = 'transparent';

let mmToPixels = 3.78; // 1mm = 3.78px
let delimeter = 10 * mmToPixels; // 10mm

let flags = {
    showCutting: false,
    showPanning: false,
    showDashing: false,
    showCircling: false
};

let drawingObjects = []; // store all the drawing objects

let axisLines = [];

let line = null;

canvas.on('mouse:move', function(options) {
    let pointer = canvas.getPointer(options.e);
    let x = roundToNearest(pointer.x, delimeter);
    let y = roundToNearest(pointer.y, delimeter);

    AxisLine.flush();

    let intersectionX = {left: 0, right: canvas.width};
    let intersectionY = {top: 0, bottom: canvas.height}

    let intersectionXWithObject = {left: 0, right: canvas.width};
    let intersectionYWithObject = {top: 0, bottom: canvas.height}
    
    let axisLineTop = new AxisLine(x, y, x, intersectionY.top);
    axisLineTop.add();

    let axisLineBottom = new AxisLine(x, y, x, intersectionY.bottom);
    axisLineBottom.add();

    let axisLineLeft = new AxisLine(x, y, intersectionX.left, y);
    axisLineLeft.add();

    let axisLineRight = new AxisLine(x, y, intersectionX.right, y);
    axisLineRight.add();

    for (let drawingObject of drawingObjects) {
        // create AxisLine and line.distanceText if axisLines of a point are passing through
        // the nearest drawing object
        drawingObject.getIntersectionWithXAxis({x: x, y: y}, intersectionXWithObject);
        drawingObject.getIntersectionWithYAxis({x: x, y: y}, intersectionYWithObject);
        if (intersectionXWithObject !== false) {
            intersectionX.left = Math.max(intersectionX.left, intersectionXWithObject.left);
            intersectionX.right = Math.min(intersectionX.right, intersectionXWithObject.right);
        }
        
        if (intersectionYWithObject !== false) {
            intersectionY.top = Math.max(intersectionY.top, intersectionYWithObject.top);
            intersectionY.bottom = Math.min(intersectionY.bottom, intersectionYWithObject.bottom);
        }
    }
    
    axisLineLeft.set({x2: intersectionX.left});
    axisLineRight.set({x2: intersectionX.right});
    axisLineTop.set({y2: intersectionY.top});
    axisLineBottom.set({y2: intersectionY.bottom});
    
    for (let axisLine of AxisLine.lines) {
        axisLine.draw();
        axisLine.calculateDistance();
        axisLine.drawDistanceText();
    }
});