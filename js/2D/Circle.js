class Circle extends fabric.Circle {
    static circles = [];

    constructor(x, y, radius) {
        super();
        this.left = x;
        this.top = y;
        this.radius = radius;
        this.originX = 'center';
        this.originY = 'center';
        this.fill = 'transparent';
        this.stroke = 'black';
        this.strokeWidth = 1;
        this.selectable = false;
    }

    draw() {
        // Draw circle
        canvas.add(this);
    }

    remove() {
        canvas.remove(this);
    }

    static add() {
        this.circles.push(circle);
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
        canvas.add(point);
    }

    getIntersectionWithXAxis(point, intersectionX) {
        let h = this.left; // x-coordinate of the center of the circle
        let k = this.top; // y-coordinate of the center of the circle
        let r = this.radius

        // use the equation of a circle to solve for x
        let x1 = h + Math.sqrt(r * r - (point.y - k) ** 2);
        let x2 = h - Math.sqrt(r * r - (point.y - k) ** 2);

        if (isNaN(x1) || isNaN(x2)) return false;
        let min = Math.min(x1, x2);
        let max = Math.max(x1, x2);

        if (point.x == h && point.y == k) {
            intersectionX.left = min;
            intersectionX.right = max;
        }
        
        else if (point.x > min && point.x < max) {
            intersectionX.left = min;
            intersectionX.right = max;
        }

        else if (point.x < min) {
            intersectionX.right = min;
        }

        else if (point.x > max) {
            intersectionX.left = max;
        }
    }

    getIntersectionWithYAxis(point, intersectionY) {
        let h = this.left; // x-coordinate of the center of the circle
        let k = this.top; // y-coordinate of the center of the circle
        let r = this.radius

        let y1 = k + Math.sqrt(r * r - (point.x - h) ** 2);
        let y2 = k - Math.sqrt(r * r - (point.x - h) ** 2);

        let min = Math.min(y1, y2);
        let max = Math.max(y1, y2);

        if (point.x == h && point.y == k) {
            intersectionY.top = min;
            intersectionY.bottom = max;
        }
        else if (point.y > min && point.y < max) {
            intersectionY.top = min;
            intersectionY.bottom = max;
        }
        else if (point.y < min) {
            intersectionY.bottom = min;
        }
        else if (point.y > max) {
            intersectionY.top = max;
        }
    }
}
