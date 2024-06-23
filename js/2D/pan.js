document.getElementById('panButton').addEventListener('click', function () {
    flags.showPanning = !flags.showPanning;
    if (flags.showCutting) {
        flags.showCutting = false;
        flushAxisLines();
    }
});

canvas.on('mouse:down', function (options) {
    if (flags.showPanning && options.e) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = options.e.clientX;
        this.lastPosY = options.e.clientY;
    }
});

canvas.on('mouse:move', function (options) {
    if (flags.showPanning) canvas.setCursor('move');
    if (this.isDragging && flags.showPanning) {
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
    this.selection = !flags.showPanning;
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