const Block = require("./Block");

class Projectile extends Block {
    constructor(x, y, width, height, speed) {
        super(x, y, width, height);
        this.name = "Projectile";
        this.color = "#60bf30";
        this.opacity = 1;
        this.zIndex = 15;
        this.speed = speed;
        this.makerDelete = false;
        this.damage = 25;
    }
    update() {
        if (this.makerDelete) this.delete();
    }
    run() {
        this.x += this.speed;
    }
    createProjectile(x, y) {
        return new Projectile(x, y, this.width, this.height);
    }
    getProjectile(x = this.x, y = this.y) {
        return this.createProjectile(x, y);
    }
}

module.exports = Projectile;
