function calculateCost(size, materialCostPerM2) {
    return size * materialCostPerM2;
}

function saveDrawing() {
    // Convert drawingData to .dxf format using js-dfx library
}

function toggleFlags(curFlag) {
    flags[curFlag] = !flags[curFlag];
    for (let flag in flags) {
        if (flag == curFlag) continue;
        flags[flag] = false;
    }
    canvas.selection = false;
}

function isBetween(n, a, b) {
    return (n - a) * (n - b) <= 0;
}

function roundToNearest(value, nearest) {
    return Math.round(value / nearest) * nearest;
}

function calculateSlope(line) {
    return (line.y2 - line.y1) / (line.x2 - line.x1);
}

function calculateYIntercept(line, m) {
    return line.y1 - m * line.x1;
}

function getIntersectionWithYAxis(line, point) {
    let m = calculateSlope(line);
    let b = calculateYIntercept(line, m);
    return m * point.x + b;
}

function getInterSectionWithXAxis(line, point) {
    if (line.x1 == line.x2) return line.x1;
    let m = calculateSlope(line);   
    let b = calculateYIntercept(line, m);
    return (point.y - b) / m;
}

function togglePreview() {
    const canvas2D = document.getElementById('canvas2D');
    const container3D = document.getElementById('container3D');

    if (canvas2D.style.display === 'none') {
        canvas2D.style.display = 'block';
        container3D.style.display = 'none';
    } else {
        canvas2D.style.display = 'none';
        container3D.style.display = 'block';
    }
}