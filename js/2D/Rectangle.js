import { canvas } from '../globals.js';

export default class Rectangle extends fabric.Rect {
    constructor(x, y, width, height) {
        super();
        this.left = x;
        this.top = y;
        this.width = width;
        this.height = height;
        this.fill = 'transparent';
        this.stroke = 'black';
        this.strokeWidth = 1;
        this.selectable = false;
        this.points = [];
    }

    draw() {
        // Draw rectangle
        canvas.add(this);
        for (let point of this.points) {
            canvas.add(point);
        }
    }

    remove() {
        canvas.remove(this);
    }

    getIntersectionWithXAxis(point, intersectionX) {
        let isBetween = this._isBetween(point.y, this.top, this.top + this.height);
        if (!isBetween) return false;

        let left = this.left;
        let right = this.left + this.width;

        if (point.x >= left && point.x <= right) {
            intersectionX.left = left;
            intersectionX.right = right;
        }
        else if (point.x < left) {
            intersectionX.right = left;
        }
        else if (point.x > right) {
            intersectionX.left = right;
        }
    }

    getIntersectionWithYAxis(point, intersectionY) {
        let isBetween = this._isBetween(point.x, this.left, this.left + this.width);
        if (!isBetween) return false;

        let top = this.top;
        let bottom = this.top + this.height;

        if (point.y >= top && point.y <= bottom) {
            intersectionY.top = top;
            intersectionY.bottom = bottom;
        }
        else if (point.y < top) {
            intersectionY.bottom = top;
        }
        else if (point.y > bottom) {
            intersectionY.top = bottom;
        }
    }

    addPointToCanvas() {
        // add vertex points for the rectangle
        let topLeft = new fabric.Point(this.left, this.top);
        let topRight = new fabric.Point(this.left + this.width, this.top);
        let bottomLeft = new fabric.Point(this.left, this.top + this.height);
        let bottomRight = new fabric.Point(this.left + this.width, this.top + this.height);
        let points = [topLeft, topRight, bottomRight, bottomLeft];
        points.forEach(point => {
            let vertex = new fabric.Circle({
                left: point.x - 3,
                top: point.y - 3,
                radius: 3,
                fill: 'transparent',
                stroke: 'red',
                selectable: false
            });
            this.points.push(vertex);
        });
    }

    removeNode() {
        for (let point of this.points) {
            canvas.remove(point);
        }
        canvas.remove(this);
    }

    _isBetween(n, a, b) {
        return n >= a && n <= b;
    }
}