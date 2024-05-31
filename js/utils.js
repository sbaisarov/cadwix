function calculateCost(size, materialCostPerM2) {
    return size * materialCostPerM2;
}

function saveDrawing() {
    // Convert drawingData to .dxf format using js-dfx library
}

function isBetween(n, a, b) {
    return (n - a) * (n - b) <= 0;
}

function roundToNearest(value, nearest) {
    return Math.round(value / nearest) * nearest;
}

function findIntersection(line1, line2) {
    // Find the intersection point of two lines
    // divide lines into points with a difference of 1 mm
    linePoints1 = getLinePoints(line1);
    linePoints2 = getLinePoints(line2);
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

function calculateDistance(line) {
    return Math.sqrt(Math.pow((line.x1 - line.x2), 2) + Math.pow((line.y1 - line.y2), 2)) / mmToPixels;
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