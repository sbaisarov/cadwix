import { history } from './history.js';

document.getElementById('undoButton').addEventListener('click', () => {
    history.undo();
});

document.getElementById('redoButton').addEventListener('click', (event) => {
    history.redo(event);
});
