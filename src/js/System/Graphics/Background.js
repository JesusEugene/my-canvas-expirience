const GameObject = require('../GameObject');

class Background extends GameObject {
    constructor(game,pos,size,color) {
        super();
        this.game = game;
        this.position = pos;
        this.size = size
        this.image = null;
        this.color = color;
    }
    initialization(){
        console.log('Background initialization')
        GameObject.num++;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x,this.position.y,this.size.width,this.size.height);
    }
}

module.exports = Background;