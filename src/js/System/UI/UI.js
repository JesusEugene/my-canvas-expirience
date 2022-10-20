
class UI {
    constructor(game) {
        this.game = game;
        this.fps = 0;
        this.enemyCount = 0;
    }
    update(deltaTime) {
        this.fps = (1000 / deltaTime).toFixed(0);
        this.enemyCount = this.game.enemyArray.length;
    }
    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`FPS: ${this.fps}`, 910, 20);
        ctx.fillText(`Count : ${this.enemyCount}`, 910, 40);
    }
}

module.exports = UI;