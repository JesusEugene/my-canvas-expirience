const GameObject = require("../GameObject");
const MouseHandler = require("../InputHandlers/MouseHandler");
const Cell = require("./Cell");

class Grid extends GameObject {
    constructor(
        x,
        y,
        offsetX,
        offsetY,
        wCount,
        hCount,
        cellWidth,
        cellHeight,
        isDrawing = false
    ) {
        super();
        this.name = "Grid";
        this.x = x;
        this.y = y;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.wCount = wCount;
        this.hCount = hCount;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.color = "#000";
        this.opacity = 1;
        this.zIndex = 1;
        this.cells = [];
        this.isDrawing = isDrawing;
    }
    initialization() {
        console.log("Grid initialization");
        for (let i = 0; i < this.wCount; i++) {
            for (let j = 0; j < this.hCount; j++) {
                const cell = new Cell(
                    this.x + i * (this.cellWidth + this.offsetX),
                    this.y + j * (this.cellHeight + this.offsetY),
                    this.cellWidth,
                    this.cellHeight
                );
                cell.isDrawing = this.isDrawing;
                Cell.zIndex = 5;
                this.cells.push(cell);
            }
        }
        this.addChildren(this.cells);
    }
    /**
     * Вернет позицию на экране
     * @param {*} position позиция на экране
     * @returns {{x: number, y: number}} вернет позицию в гриде
     */
    getGridPosition(pos) {
        let size = {
            x: this.cellWidth + this.offsetX,
            y: this.cellHeight + this.offsetY,
        };
        let position = {
            x: pos.x - this.x,
            y: pos.y - this.y,
        };
        let o = {
            x: (position.x - (position.x % size.x)) / size.x,
            y: (position.y - (position.y % size.y)) / size.y,
        };

        return o;
    }
    /**
     * Вернет ячейку по индексу
     * @param {*} index индекс
     * @returns {Cell} вернет ячейку
     */
    getCellByIndex(index) {
        return index < this.cells.length ? this.cells[index] : null;
    }
    /**
     * Вернет ячейку по позиции в гриде
     * @param {{x:number,y:number}} gridPosition
     * @returns {{Cell}} вернет ячейку
     */
    getCellByGridPosition(gridPosition) {
        let n = gridPosition.x * this.hCount + gridPosition.y;
        return gridPosition.x >= 0 &&
            gridPosition.x < this.wCount &&
            gridPosition.y >= 0 &&
            gridPosition.y < this.hCount
            ? this.getCellByIndex(n)
            : null;
    }

    /**
     * Вернут ячейку по позиции на экране
     * @param {{x:number,y:number}} position позиция на экране
     * @returns {{Cell}} вернет ячейку
     *
     */
    getCellByPosition(position) {
        let o = this.getGridPosition(position);

        return this.getCellByGridPosition(o);
    }
}

module.exports = Grid;
