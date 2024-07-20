import { drawingObjects, canvas } from './globals.js'

class CanvasHistory {
    constructor(canvas) {
        this.canvas = canvas;
        this.removedObjects = [];
    }
    
    undo() {
        let item = drawingObjects.pop();
        this.removedObjects.push(item);
        if (item) {
            item.removeNode();
        }
    }
    redo(event) {
        if (this.removedObjects.length === 0) {
            return;
        }
        let item = this.removedObjects.pop();
        drawingObjects.push(item);
        if (item) {
            item.draw(event);
        }
    }
}

let history = new CanvasHistory(canvas);

document.getElementById('undoButton').addEventListener('click', () => {
    history.undo();
});

document.getElementById('redoButton').addEventListener('click', (event) => {
    history.redo(event);
});