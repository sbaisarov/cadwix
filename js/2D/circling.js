let circle = null;
let isDown = false;
let radius = 37.8;

document.getElementById('circleButton').addEventListener('click', function () {
    toggleFlags('showCircling');
});

canvas.on('mouse:down', function (options) {
    if (!flags.showCircling) return;

    let pointer = canvas.getPointer(options.e);
    let x = roundToNearest(pointer.x, delimeter);
    let y = roundToNearest(pointer.y, delimeter);
    isDown = true;
    if (circle) circle.addPointToCanvas(options);
})

canvas.on('mouse:move', function(event) {
    if (flags.showCircling == false) return;
    // Remove the circle if it exists and the mouse is not down
    if (circle != null && isDown == false) {
        canvas.remove(circle);
    }
    let pointer = canvas.getPointer(event.e);
    let x = roundToNearest(pointer.x, delimeter);
    let y = roundToNearest(pointer.y, delimeter);
    // Calcuilate the distance between the mouse and the center of the circle
    if (isDown && circle) {
        radius = Math.sqrt((x - circle.left) ** 2 + (y - circle.top) ** 2);
        circle.set({ radius: radius });
    }
    else  {
        circle = new Circle(x, y, radius);
        circle.draw();
    }
})

canvas.on('mouse:up', function(options) {
    if (!flags.showCircling) return;
    isDown = false;
    drawingObjects.push(circle);
    circle.draw();
})