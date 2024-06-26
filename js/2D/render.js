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
    axisLineTop.add();

    let axisLineBottom = new AxisLine(x, y, x, nearestIntersectionYBottom);
    axisLineBottom.add();

    let axisLineLeft = new AxisLine(x, y, nearestIntersectionXLeft, y);
    axisLineLeft.add();

    let axisLineRight = new AxisLine(x, y, nearestIntersectionXRight, y);
    axisLineRight.add();

    for (let drawingObject of drawingObjects) {
        // create AxisLine and line.distanceText if axisLines of a point are passing through
        // the nearest line
        let isIntersectsHorizontal = drawingObject.intersectsWithObject(axisLineLeft) || drawingObject.intersectsWithObject(axisLineRight);
        let isIntersectsVertical = drawingObject.intersectsWithObject(axisLineTop) || drawingObject.intersectsWithObject(axisLineBottom);
        if (isIntersectsHorizontal) {
            intersectionX = getInterSectionWithXAxis(drawingObject, {x: x, y: y});
            // if intersectionX is NaN, then the line is horizontal
            if (isNaN(intersectionX)) {
                nearestIntersectionXLeft = Math.min(nearestIntersectionXLeft, drawingObject.x1, drawingObject.x2);
                nearestIntersectionXRight = Math.min(nearestIntersectionXRight, drawingObject.x1, drawingObject.x2);
            }
            else {
                if (intersectionX < x) {
                    nearestIntersectionXLeft = Math.max(nearestIntersectionXLeft, intersectionX);
                }
                else {
                    nearestIntersectionXRight = Math.min(nearestIntersectionXRight, intersectionX);
                }
            }
        }
        
        if (isIntersectsVertical) {
            intersectionY = getIntersectionWithYAxis(drawingObject, {x: x, y: y});
            // if intersectionY is NaN, then the line is vertical
            if (isNaN(intersectionY)) {
                nearestIntersectionYTop = Math.min(nearestIntersectionYTop, drawingObject.y1, drawingObject.y2);
                nearestIntersectionYBottom = Math.min(nearestIntersectionYBottom, drawingObject.y1, drawingObject.y2);
            }
            else {
                if (intersectionY < y) {
                    nearestIntersectionYTop = Math.max(nearestIntersectionYTop, intersectionY);
                }
                else {
                    nearestIntersectionYBottom = Math.min(nearestIntersectionYBottom, intersectionY);
                }
            }
        }
    }
    
    axisLineLeft.set({x2: nearestIntersectionXLeft});
    axisLineRight.set({x2: nearestIntersectionXRight});
    axisLineTop.set({y2: nearestIntersectionYTop});
    axisLineBottom.set({y2: nearestIntersectionYBottom});
    
    for (let axisLine of AxisLine.lines) {
        axisLine.draw();
        axisLine.calculateDistance();
        axisLine.drawDistanceText();
    }
});