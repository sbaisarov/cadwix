import { canvas, drawingObjects, delimeter } from '../globals.js';
import { roundToNearest } from '../utils.js';
import { AxisLine } from './Line.js';

canvas.freeDrawingBrush.width = 5;
canvas.freeDrawingBrush.color = 'black';
canvas.hoverCursor = 'default';
canvas.selectionColor = 'transparent';

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