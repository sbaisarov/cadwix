// cut material in a straight line
document.getElementById('cutButton').addEventListener('click', function () {
    toggleFlags('showCutting');
})

document.getElementById('dashingButton').addEventListener('click', function () {
    toggleFlags('showDashing');
})

canvas.on('mouse:down', function (options) {
    if (!flags.showCutting && !flags.showDashing || line != null) return;

    let pointer = canvas.getPointer(options.e);
    let x = roundToNearest(pointer.x, delimeter);
    let y = roundToNearest(pointer.y, delimeter);
    if (flags.showDashing) {
        line = new DashedLine(x, y, x, y);
    } else if (flags.showCutting) {
        line = new CuttingLine(x, y, x, y);
    }
    line.draw();
})

canvas.on('mouse:move', function (options) {
    if (!flags.showCutting && !flags.showDashing) return;
    let pointer = canvas.getPointer(options.e);
    let x = roundToNearest(pointer.x, delimeter);
    let y = roundToNearest(pointer.y, delimeter);
    if (line != null) {
        // Remove previous line measurement
        line.remove('move');
        line.x2 = x;
        line.y2 = y;
        line.calculateDistance();
        line.drawDistanceText();
        
        // Calculate the angle between the x-axis and the line
        line.calculateAngle();
        
        line.drawArc();
        line.drawAngleText();
        canvas.renderAll();
    }
})

canvas.on('mouse:up', function (options) {
    if (!flags.showCutting && !flags.showDashing) return;

    line.addPointToCanvas(options.e);

    if (line == null || line.distanceText == null) return;
    // add line to the array of drawingObjects to find axis line passing through
    drawingObjects.push(line);

    // remove the line
    line.remove('up');
    line = null;
    canvas.renderAll();
})
