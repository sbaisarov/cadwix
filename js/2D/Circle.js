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

    getIntersectionWithCircle(axisLine, circle) {
        let r = circle.radius;
        let k = circle.top;
        let h = circle.left;

        if (axisLine.x1 == axisLine.x2) {
            let y1 = k + Math.sqrt(r*r - (x-h)*(x-h));
            let y2 = k - Math.sqrt(r*r - (x-h)*(x-h));
            let y = Math.max(y1, y2);
            return {x: axisLine.x1, y: y};
        } else if (axisLine.y1 == axisLine.y2) {
            let x1 = h + Math.sqrt(r*r - (y-k)*(y-k));
            let x2 = h - Math.sqrt(r*r - (y-k)*(y-k));
            let x = Math.min(x1, x2);
            return {x: x, y: axisLine.y1};
        }
    }
}

