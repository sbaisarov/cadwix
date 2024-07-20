import { canvas, mmToPixels, delimeter } from '../globals.js';
import { roundToNearest } from '../utils.js';

class Line extends fabric.Line {
    constructor(x1, y1, x2, y2) {
        super([x1, y1, x2, y2], {
            stroke: 'black',
            strokeWidth: 1,
            selectable: false,
            objectCaching: true
        });

        this.distanceText = null;
        this.distance = 0;

        this.arc = null;
        this.angleText = null;
        this.angleInRadians = 0;
        this.angleInDegrees = 0;

        this.points = [];
    }

    draw() {
        canvas.add(this);
    }

    drawDistanceText() {
        this.distanceText = new fabric.Text(this.distance.toFixed(1) + 'mm', {
            left: (this.x1 + this.x2) / 2,
            top: (this.y1 + this.y2) / 2 - 10,
            fontSize: 16,
            originX: 'center',
            originY: 'bottom',
            selectable: false,
            objectCaching: true
        });
        canvas.add(this.distanceText);
    }

    drawAngleText() {
        this.angleText = new fabric.Text(this.angleInDegrees.toFixed(2) + '°', {
            left: (this.x1 + this.x2) / 2 + 30,
            top: (this.y1 + this.y2) / 2 + 30,
            fontSize: 16,
            originX: 'center',
            originY: 'bottom',
            selectable: false,
            objectCaching: true
        });
        canvas.add(this.angleText);
    }

    drawArc() {
        let radius = this.distance;
        let sweepFlag = (this.angleInRadians <= Math.PI) ? 1 : 0;
        let path = `M ${this.x1 + radius} ${this.y1} A ${radius} ${radius} 0 0
                    ${sweepFlag} ${this.x1 + radius * Math.cos(this.angleInRadians)}
                    ${this.y1 + radius * Math.sin(this.angleInRadians)}`;
        this.arc = new fabric.Path(path, {
                                    stroke: 'black',
                                    strokeWidth: 2,
                                    fill: 'transparent',
                                    selectable: false,
                                    objectCaching: true
            });
        canvas.add(this.arc);
    }

    calculateDistance() {
        this.distance = Math.sqrt(Math.pow((this.x1 - this.x2), 2) + Math.pow((this.y1 - this.y2), 2)) / mmToPixels;
    }

    calculateAngle() {
        this.angleInRadians = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
        this.angleInDegrees = -this.angleInRadians * (180 / Math.PI);

        // Convert angle to positive
        if (this.angleInRadians < 0) this.angleInRadians += 2 * Math.PI;
    }

    addPointToCanvas(event) {
        let pointer = canvas.getPointer(event);
        let x = roundToNearest(pointer.x, delimeter);
        let y = roundToNearest(pointer.y, delimeter);
        let point = new fabric.Circle({
            left: x - 3,
            top: y - 3,
            radius: 3,
            fill: 'transparent',
            stroke: 'red',
            selectable: false
        });
        this.points.push(point);
        canvas.add(point);
    }

    getIntersectionWithXAxis(point, intersectionX) {
        let isBetween = this._isBetween(point.y, this.y1, this.y2);
        if (!isBetween) return false;
        
        let m = this._calculateSlope();
        let b = this._calculateYIntercept(m);
        let result = (point.y - b) / m;
        if (result < point.x) {
            intersectionX.left = result;
        }
        else if (point.x == this.x1 || point.x == this.x2) return false;

        else if (isNaN(result)) {
            // If the line is vertical
            if (point.x < this.x1) intersectionX.right = this.x1;
            else if (point.x > this.x1) intersectionX.left = this.x2;
            else return false;
        }

        else {
            intersectionX.right = result;
        }
    }
    
    getIntersectionWithYAxis(point, intersectionY) {
        let isBetween = this._isBetween(point.x, this.x1, this.x2);
        if (!isBetween) return false;

        let result;
        let m = this._calculateSlope();   
        let b = this._calculateYIntercept(m);
        result = m * point.x + b;
        if (result < point.y) {
            intersectionY.top = result;
        }
        else if (isNaN(result) || result == point.y) {
            return false;
        }
        else {
            intersectionY.bottom = result;
        }
    }

    removeNode() {
        for (let point of this.points) {
            canvas.remove(point);
        }
        canvas.remove(this.distanceText);
        canvas.remove(this);
    }

    _calculateSlope() {
        return (this.y2 - this.y1) / (this.x2 - this.x1);
    }
    
    _calculateYIntercept(m) {
        return this.y1 - m * this.x1;
    }

    _isBetween(n, a, b) {
        // @param n: point x or point y
        // @param a: line start
        // @param b: line end
        return (n - a) * (n - b) <= 0;
    }
}

class AxisLine extends Line {
    static lines = [];

    constructor(x1, y1, x2, y2) {
        super(x1, y1, x2, y2);
    }

    add() {
        AxisLine.lines.push(this);
    }
    
    static flush() {
        for (let line of this.lines) {
            canvas.remove(line.distanceText);
            canvas.remove(line);
        }
        this.lines = [];
    }
}

class CuttingLine extends Line {

    constructor(x1, y1, x2, y2) {
        super(x1, y1, x2, y2);
    }

    remove(mode) {
        if (mode == 'move') canvas.remove(this.distanceText);
        canvas.remove(this.arc);
        canvas.remove(this.angleText);
    }
        
}

class DashedLine extends Line {

    constructor(x1, y1, x2, y2) {
        super(x1, y1, x2, y2);
        this.strokeDashArray = [5, 5];
    }

    remove(mode) {
        if (mode == 'move') canvas.remove(this.distanceText);
        canvas.remove(this.arc);
        canvas.remove(this.angleText);
    }
}

export { CuttingLine, DashedLine, AxisLine };