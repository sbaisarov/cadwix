// cut material in a straight line
document.getElementById('cutButton').addEventListener('click', function () {
    isCutting = !isCutting; // toggle cutting
    if (isPanning) isPanning = false; // disable panning
    if (isDashing) isDashing = false; // disable dashing
    canvas.selection = false;
})

document.getElementById('dashingButton').addEventListener('click', function () {
    isDashing = !isDashing; // toggle dashing
    if (isPanning) isPanning = false; // disable panning
    if (isCutting) isCutting = false; // disable cutting
    canvas.selection = false;
});

canvas.on('mouse:down', function (options) {
    if (!isCutting && !isDashing || line != null) return;

    let pointer = canvas.getPointer(options.e);
    let x = roundToNearest(pointer.x, delimeter);
    let y = roundToNearest(pointer.y, delimeter);
    if (isDashing) {
        line = new DashedLine(x, y, x, y);
    } else if (isCutting
    ) {
        line = new CuttingLine(x, y, x, y);
    }
    line.draw();
})

canvas.on('mouse:move', function (options) {
    if (!isCutting && !isDashing) return;
    let pointer = canvas.getPointer(options.e);
    let intersectionX, intersectionY;
    // round to nearest grid point
    let x = roundToNearest(pointer.x, delimeter);
    let y = roundToNearest(pointer.y, delimeter);
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
    
    // update axisLines and line.distanceText if axisLines of a point are passing through
    // the nearest line
    if (facilities.length == 0) return;
    
    for (let line of facilities) {
        if (isBetween(x, line.x1, line.x2)) {
            intersectionY = getIntersectionWithYAxis(line, {x: x, y: y});
            axisLine = axisLines.find(axisLine => isBetween(intersectionY, axisLine.y1, axisLine.y2));
            if (!axisLine) continue;

            // update axisLine coordinates and distance text
            canvas.remove(axisLine.distanceText);
            axisLine.y2 = intersectionY;
            axisLine.calculateDistance();
            axisLine.drawDistanceText();
        } 
        if (isBetween(y, line.y1, line.y2)) {
            intersectionX = getInterSectionWithXAxis(line, {x: x, y: y}); 
            axisLine = axisLines.find(axisLine => isBetween(intersectionX, axisLine.x1, axisLine.x2));
            if (!axisLine) continue;

            // update axisLine coordinates and distance text
            canvas.remove(axisLine.distanceText);
            axisLine.x2 = intersectionX;
            axisLine.calculateDistance();
            axisLine.drawDistanceText();
        }
    }
    canvas.renderAll();
})

canvas.on('mouse:up', function (options) {
    if (!isCutting && !isDashing) return;

    line.addPointToCanvas(options.e);

    if (line == null || line.distanceText == null) return;
    // add line to the array of facilities to find axis line passing through
    facilities.push(line);

    // remove the line
    line.remove('up');
    line = null;
    canvas.renderAll();
})

function addPointToCanvas(event) {
    let pointer = canvas.getPointer(event);
    let x = roundToNearest(pointer.x, delimeter);
    let y = roundToNearest(pointer.y, delimeter);
    let point = new fabric.Circle({
        left: x - 3,
        top: y - 3,
        radius: 3,
        fill: 'transparent',
        stroke: 'red',
        selectable: false
    });
    canvas.add(point);
}