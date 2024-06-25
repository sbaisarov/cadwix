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
let axisLine = null;

let line = null;

canvas.on('mouse:move', function(options) {
    let pointer = canvas.getPointer(options.e);
    let x = roundToNearest(pointer.x, delimeter);
    let y = roundToNearest(pointer.y, delimeter);
    AxisLine.flush();
    let nearestIntersectionXLeft = 0;
    let nearestIntersectionXRight = canvas.width;
    let nearestIntersectionYTop = 0;
    let nearestIntersectionYBottom = canvas.height;
    
    let axisLineTop = new AxisLine(x, y, x, nearestIntersectionYTop);
    AxisLine.add(axisLineTop);

    let axisLineBottom = new AxisLine(x, y, x, nearestIntersectionYBottom);
    AxisLine.add(axisLineBottom);

    let axisLineLeft = new AxisLine(x, y, nearestIntersectionXLeft, y);
    AxisLine.add(axisLineLeft);

    let axisLineRight = new AxisLine(x, y, nearestIntersectionXRight, y);
    AxisLine.add(axisLineRight);

    for (let drawingObject of drawingObjects) {
        // create AxisLine and line.distanceText if axisLines of a point are passing through
        // the nearest line
        if (drawingObject instanceof Line) {
            // sad workaround to access the line object
            drawingObject = drawingObject.line;
        }
        let isIntersectsHorizontal = drawingObject.intersectsWithObject(axisLineLeft) || drawingObject.intersectsWithObject(axisLineRight);
        let isIntersectsVertical = drawingObject.intersectsWithObject(axisLineTop) || drawingObject.intersectsWithObject(axisLineBottom);
        if (isIntersectsHorizontal) {
            intersectionX = getInterSectionWithXAxis(drawingObject, {x: x, y: y});
            // if intersectionX is NaN, then the line is horizontal
            if (isNaN(intersectionX)) {
                axisLineLeft.x2 = Math.min(axisLineLeft.x2, drawingObject.x1, drawingObject.x2);
                axisLineRight.x2 = Math.min(axisLineRight.x2, drawingObject.x1, drawingObject.x2);
            }
            else {
                if (intersectionX < x) {
                    axisLineLeft.x2 = Math.max(axisLineLeft.x2, intersectionX);
                }
                else {
                    axisLineRight.x2 = Math.min(axisLineRight.x2, intersectionX);
                }
            }
        }

        if (isIntersectsVertical) {
            intersectionY = getIntersectionWithYAxis(drawingObject, {x: x, y: y});
            // if intersectionY is NaN, then the line is vertical
            if (isNaN(intersectionY)) {
                axisLineTop.y2 = Math.min(axisLineTop.y2, drawingObject.y1, drawingObject.y2);
                axisLineBottom.y2 = Math.min(axisLineBottom.y2, drawingObject.y1, drawingObject.y2);
            }
            else {
                if (intersectionY < y) {
                    axisLineTop.y2 = Math.max(axisLineTop.y2, intersectionY);
                }
                else {
                    axisLineBottom.y2 = Math.min(axisLineBottom.y2, intersectionY);
                }
            }
        }
    }
    

    for (let axisLine of AxisLine.drawingObjects) {
        axisLine.draw();
        axisLine.calculateDistance();
        axisLine.drawDistanceText();
    }
});