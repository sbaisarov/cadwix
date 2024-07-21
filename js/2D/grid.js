import { delimeter, mmToPixels, canvas } from "../globals";

function drawRulersAndGrid() {
    let rulerLength = 100 * mmToPixels; // 100mm
    // Draw horizontal ruler
    var line, text;
    var i;
    for (i = 0; i <= rulerLength; i += delimeter) {
        line = new fabric.Line([i, 0, i, 20], {
            stroke: 'black',
            selectable: false
        });
        canvas.add(line);

        text = new fabric.Text(Math.round((i / mmToPixels)).toString(), {
            left: i,
            top: 20,
            fontSize: 10,
            selectable: false
        });
        canvas.add(text);
    }
    
    // Draw vertical ruler
    for (i = 0; i <= rulerLength; i += delimeter) {
        line = new fabric.Line([0, i, 20, i], {
            stroke: 'black',
            selectable: false
        });
        canvas.add(line);

        text = new fabric.Text(Math.round((i / mmToPixels)).toString(), {
            left: 20,
            top: i,
            fontSize: 10,
            selectable: false
        });
        canvas.add(text);
    }
    // Draw grid
    for (i = 0; i < canvas.width; i += delimeter) {
        var gridLineH = new fabric.Line([0, i, canvas.height, i], {
            stroke: '#ddd',
            selectable: false
        });
        canvas.add(gridLineH);

        var gridLineV = new fabric.Line([i, 0, i, canvas.height], {
            stroke: '#ddd',
            selectable: false
        });
        canvas.add(gridLineV);
    }
}

drawRulersAndGrid();
// add x, y axis passing through the center of the canvas
canvas.add(new fabric.Line([delimeter * 5, delimeter * 5, delimeter * 8, delimeter * 5], { stroke: 'red', selectable: false }));
canvas.add(new fabric.Line([delimeter * 5, delimeter * 5, delimeter * 5, delimeter * 2], { stroke: 'blue', selectable: false }));