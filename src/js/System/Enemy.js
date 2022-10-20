const Block = require("./Block");

class Enemy extends Block {
    constructor(x, y, width, height, speed) {
        super(x, y, width, height);
        this.name = "Enemy";
        this.color = "#f00";
        this.opacity = 1;
        this.zIndex = 0;
        this.speed = speed;
        this.health = 100;
    }
    update() {
        this.text = this.health;
        if (this.health <= 0) this.delete();
    }
    run() {
        this.x += this.speed;
    }
    createEnemy(x, y) {
        return new Enemy(x, y, this.width, this.height);
    }
    getEnemy(x = this.x, y = this.y) {
        return this.createEnemy(x, y);
    }
}

module.exports = Enemy;
