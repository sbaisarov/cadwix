class Line extends fabric.Line {
    constructor(x1, y1, x2, y2) {
        super();
        // this.x1 = x1;
        // this.y1 = y1;
        // this._x2 = x2;
        // this._y2 = y2;

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

    // get x2() {
    //     return this._x2;
    // }

    // get y2() {
    //     return this._y2;
    // }

    // set y2(value) {
    //     this._y2 = value;
    //     this.line.set({ y2: value });
    // }

    // set x2(value) {
    //     this._x2 = value;
    //     this.line.set({ x2: value });
    // }

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
        // this.line = new fabric.Line([this.x1, this.y1, this.x2, this.y2], {
        //     stroke: 'black',
        //     strokeWidth: 1,
        //     selectable: false,
        //     objectCaching: true
        // });
        canvas.add(this);
    }

    static add() {
        this.lines.push(this);
    }
    
    static flush() {
        for (let line of this.lines) {
            canvas.remove(this.distanceText);
            canvas.remove(this);
        }
        this.lines = [];
    }
}

class CuttingLine extends Line {
    draw() {
        // Draw cutting line
        this.line = new fabric.Line([this.x1, this.y1, this.x2, this.y2], {
            stroke: 'black',
            strokeWidth: 2,
            selectable: false,
            objectCaching: true
        });
        canvas.add(this.line);
    }

    remove(mode) {
        if (mode == 'move') canvas.remove(this.distanceText);
        canvas.remove(this.arc);
        canvas.remove(this.angleText);
    }
}

class DashedLine extends Line {
    draw() {
        // Draw dashed line
        this.line = new fabric.Line([this.x1, this.y1, this.x2, this.y2], {
            stroke: 'black',
            strokeWidth: 2,
            selectable: false,
            objectCaching: true,
            strokeDashArray: [5, 5]
        });
        canvas.add(this.line);
    }

    remove(mode) {
        if (mode == 'move') canvas.remove(this.distanceText);
        canvas.remove(this.arc);
        canvas.remove(this.angleText);
    }
}
