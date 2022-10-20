const GameObject = require("../GameObject");
const MouseHandler = require("../InputHandlers/MouseHandler");
class Cell extends GameObject {
    constructor(x, y, width, height) {
        super();
        this.name = "Cell";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "#000";
        this.opacity = 0.5;
        this.zIndex = 1;
        this.isDrawing = true;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        if (this.isDrawing) {
            ctx.font = "20px Arial";
            ctx.fillText(this.x + " " + this.y, this.x, this.y);
        }
        ctx.restore();
    }
    getPosition() {
        return {
            x: this.x,
            y: this.y,
        };
    }

    /**
     * Коллизия объекта с точкой
     * @param {{x,y}} position точка с координатами x и y
     * @param {Cell} cell объект cell с x, y, width, height
     * @returns
     */
    static collision(position, cell) {
        return (
            position.x >= cell.x &&
            position.x <= cell.x + cell.width &&
            position.y >= cell.y &&
            position.y <= cell.y + cell.height
        );
    }
}

module.exports = Cell;
