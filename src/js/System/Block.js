const GameObject = require("./GameObject");

class Block extends GameObject {
    constructor(x, y, width, height) {
        super();
        this.name = "Block";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "#2f0";
        this.opacity = 1;
        this.zIndex = 2;
        this.text = "";
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.text) {
            ctx.font = "20px Arial";
            ctx.fillText(this.text, this.x, this.y);
        }
        ctx.restore();
    }
}

module.exports = Block;
