export let canvas = new fabric.Canvas('canvas2D');
// set size 100 x 100 mm
canvas.setWidth(378);
canvas.setHeight(378);

export let drawingObjects = []; // store all the drawing objects

export let mmToPixels = 3.78; // 1mm = 3.78px
export let delimeter = 10 * mmToPixels; // 10mm

export let flags = {
    showCutting: false,
    showPanning: false,
    showDashing: false,
    showCircling: false,
    showRectangling: false
};