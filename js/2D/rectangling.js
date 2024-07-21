import Rectangle from './Rectangle.js'
import { canvas, drawingObjects, flags, delimeter } from '../globals.js';
import { roundToNearest, toggleFlags } from '../utils.js';

let rect = null;
let isDownRect = false;

document.getElementById('rectangleButton').addEventListener('click', function () {
    toggleFlags('showRectangling');
});

canvas.on('mouse:down', function () {
    if (flags.showRectangling == false) return;

    isDownRect = true;
})

canvas.on('mouse:move', function(event) {
    if (flags.showRectangling == false) return;
    // Remove the rectangle if it exists and the mouse is not down
    if (rect != null && isDownRect == false) {
        canvas.remove(rect);
    }
    let pointer = canvas.getPointer(event.e);
    let x = roundToNearest(pointer.x, delimeter);
    let y = roundToNearest(pointer.y, delimeter);
    // Calcuilate the distance between the mouse and the center of the rectangle
    if (isDownRect && rect) {
        let width = x - rect.left;
        let height = y - rect.top;
        rect.set({ width: width, height: height });
    }
    else  {
        rect = new Rectangle(x, y, 0, 0);
        rect.draw();
    }
})

canvas.on('mouse:up', function() {
    isDownRect = false;
    
    if (flags.showRectangling == false || rect.width == 0 || rect.height == 0) {
        return;
    }
    
    drawingObjects.push(rect);
    // add vertex points
    rect.addPointToCanvas();
    rect.draw();
})
