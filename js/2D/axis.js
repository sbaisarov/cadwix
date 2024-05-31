function flushAxisLines() {
    for (axisLine of axisLines) {
        axisLine.remove();
    }
    axisLines = [];
}


canvas.on('mouse:move', function (options) {
    // workaround to disable the move cursor and the selection box
    canvas.selection = false;
    canvas.hoverCursor = 'default';

    // add axis lines
    if (!isCutting && !isDashing) return;

    var pointer = canvas.getPointer(options.e);

    // Round to nearest grid point
    var x = roundToNearest(pointer.x, delimeter);
    var y = roundToNearest(pointer.y, delimeter);

    // Draw x-axis line towards the right
    let lineX = new AxisLine(x, y, this.width, y);
    lineX.draw();
    lineX.calculateDistance();
    lineX.drawDistanceText();
    
    // Draw x-axis line towards the left
    let lineX1 = new AxisLine(x, y, 0, y);
    lineX1.draw();
    lineX1.calculateDistance();
    lineX1.drawDistanceText();
    
    // Draw y-axis line towards the top
    let lineY = new AxisLine(x, y, x, this.height);
    lineY.draw();
    lineY.calculateDistance();
    lineY.drawDistanceText();
    
    // Draw y-axis line towards the bottom
    let lineY1 = new AxisLine(x, y, x, 0);
    lineY1.draw();
    lineY1.calculateDistance();
    lineY1.drawDistanceText();
    // remove previous axis lines
    flushAxisLines();
    
    axisLines.push(lineX, lineX1, lineY, lineY1);
    
    canvas.renderAll();

});
