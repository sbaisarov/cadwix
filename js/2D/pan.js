document.getElementById('panButton').addEventListener('click', function () {
    isPanning = !isPanning;
    if (isCutting) {
        isCutting = false;
        flushAxisLines();
    }
});

canvas.on('mouse:down', function (options) {
    if (isPanning && options.e) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = options.e.clientX;
        this.lastPosY = options.e.clientY;
    }
});

canvas.on('mouse:move', function (options) {
    if (isPanning) canvas.setCursor('move');
    if (this.isDragging && isPanning) {
        var e = options.e;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
    }
});

canvas.on('mouse:up', function (options) {
    this.isDragging = false;
    this.selection = !isPanning;
});

// Zoom canvas
canvas.on('mouse:wheel', function (options) {
    var delta = options.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.setZoom(zoom);
    options.e.preventDefault();
    options.e.stopPropagation();
});