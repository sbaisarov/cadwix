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

let lines = []; // store all the drawing objects

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

    for (let line of lines) {
        // create AxisLine and line.distanceText if axisLines of a point are passing through
        // the nearest line
        if (isBetween(y, line.y1, line.y2)) {
            intersectionX = getInterSectionWithXAxis(line, {x: x, y: y});
            // if intersectionX is NaN, then the line is horizontal
            if (isNaN(intersectionX)) {
                nearestIntersectionXLeft = Math.min(nearestIntersectionXLeft, line.x1, line.x2);
                nearestIntersectionXRight = Math.min(nearestIntersectionXRight, line.x1, line.x2);
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

        if (isBetween(x, line.x1, line.x2)) {
            intersectionY = getIntersectionWithYAxis(line, {x: x, y: y});
            // if intersectionY is NaN, then the line is vertical
            if (isNaN(intersectionY)) {
                nearestIntersectionYTop = Math.min(nearestIntersectionYTop, line.y1, line.y2);
                nearestIntersectionYBottom = Math.min(nearestIntersectionYBottom, line.y1, line.y2);
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
    
    let axisLineTop = new AxisLine(x, y, x, nearestIntersectionYTop);
    AxisLine.add(axisLineTop);

    let axisLineBottom = new AxisLine(x, y, x, nearestIntersectionYBottom);
    AxisLine.add(axisLineBottom);

    let axisLineLeft = new AxisLine(x, y, nearestIntersectionXLeft, y);
    AxisLine.add(axisLineLeft);

    let axisLineRight = new AxisLine(x, y, nearestIntersectionXRight, y);
    AxisLine.add(axisLineRight);

    for (let axisLine of AxisLine.lines) {
        axisLine.draw();
        axisLine.calculateDistance();
        axisLine.drawDistanceText();
    }
});