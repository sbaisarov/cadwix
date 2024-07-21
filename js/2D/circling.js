import Circle from './Circle.js'
import { canvas, delimeter, flags, drawingObjects } from '../globals.js'
import { toggleFlags, roundToNearest } from '../utils.js'

let circle = null;
let isDownCircle = false;
let radius = 37.8;

document.getElementById('circleButton').addEventListener('click', function () {
    toggleFlags('showCircling');
    if (circle) {
        canvas.remove(circle);
        circle = null;
    }
});

canvas.on('mouse:down', function (options) {
    if (!flags.showCircling) return;
    
    isDownCircle = true;
    if (circle) circle.addPointToCanvas(options);
});

canvas.on('mouse:move', function(event) {
    if (flags.showCircling == false) return;
    // Remove the circle if it exists and the mouse is not down
    if (circle != null && isDownCircle == false) {
        canvas.remove(circle);
    }
    let pointer = canvas.getPointer(event.e);
    let x = roundToNearest(pointer.x, delimeter);
    let y = roundToNearest(pointer.y, delimeter);
    // Calcuilate the distance between the mouse and the center of the circle
    if (isDownCircle && circle) {
        radius = Math.sqrt((x - circle.left) ** 2 + (y - circle.top) ** 2);
        circle.set({ radius: radius });
    }
    else  {
        circle = new Circle(x, y, radius);
        circle.draw();
    }
});

canvas.on('mouse:up', function() {
    if (!flags.showCircling) return;
    isDownCircle = false;
    drawingObjects.push(circle);
    circle.draw();
});