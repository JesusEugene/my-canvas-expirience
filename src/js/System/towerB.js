const Tower = require("./Tower");

class TowerB extends Tower {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.name = "TowerB";
        this.color = "#00B";
        this.opacity = 1;
        this.zIndex = 1;
    }

    getTower(x, y) {
        return new TowerB(x, y, this.width, this.height);
    }
}

module.exports = TowerB;
