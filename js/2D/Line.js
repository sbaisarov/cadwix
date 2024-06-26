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
    }

    draw() {
        // This method should be implemented in the child class
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
        let path = `M ${line.x1 + radius} ${line.y1} A ${radius} ${radius} 0 0
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
        canvas.add(point);
    }
}

class AxisLine extends Line {
    static lines = [];

    constructor(x1, y1, x2, y2) {
        super(x1, y1, x2, y2);
    }
    
    draw() {
        // Draw axis line
        canvas.add(this);
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

    draw() {
        // Draw cutting line
        canvas.add(this);
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
    }

    draw() {
        // Draw dashed line
        canvas.add(this);
    }

    remove(mode) {
        if (mode == 'move') canvas.remove(this.distanceText);
        canvas.remove(this.arc);
        canvas.remove(this.angleText);
    }
}
