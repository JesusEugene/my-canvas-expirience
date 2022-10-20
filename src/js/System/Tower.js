const GameObject = require("./GameObject");
const MouseHandler = require("./InputHandlers/MouseHandler");
const Cell = require("./Grid/Cell");
const Grid = require("./Grid/Grid");
const Block = require("./Block");

class Tower extends Block {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.name = "Tower";
        this.color = "#2f0";
        this.opacity = 1;
        this.zIndex = 1;
        this.timer = 0;
        this.interval = 1000;
        this.health = 100;
    }
    update(deltaTime) {
        this.timer += deltaTime;
        if (this.health <= 0) {
            this.delete();
        }
    }
    createTower(x, y) {
        return new Tower(x, y, this.width, this.height);
    }
    getTower(x = this.x, y = this.y) {
        return this.createTower(x, y);
    }
}

module.exports = Tower;
