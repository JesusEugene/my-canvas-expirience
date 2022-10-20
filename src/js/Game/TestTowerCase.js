class TestTowerCase{
    constructor(game){
        this.game = game;
        //this.image = document.getElementById('car');
        this.width = 50;
        this.height = 50;
        this.angle = 0;
        this.va = 0.01;
        this.x1 = 250;
        this.y1 = 250;
        this.x2 = 200;
        this.y2 = 200
        this.a = 0;
        this.b = 0;
        this.c = 0;

    }
    update(deltaTime){
        this.x1 = this.game.mw.getMousePos().x;
        this.y1 = this.game.mw.getMousePos().y;
        this.a = (this.x1 - this.x2),
        this.c = (this.y1 - this.y2),
        this.b = Math.sqrt(this.a*this.a + this.c*this.c),
        this.angle = Math.acos(this.a/this.b);

       
    }
    draw(ctx){
        
        ctx.save();
        // Рисуем круг
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x1,this.y1,5, 0, Math.PI*2, false); // рисовать круг
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = 'red';
        ctx.fill();
        //ctx.translate(this.x, this.y);
        ctx.translate(this.x2,this.y2) // перейти в точку 

        // Рисуем круг
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.arc(0,0,5, 0, Math.PI*2, false); // рисовать круг
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = 'red';
        ctx.fill();

        //context.moveTo(30, 20);
        ctx.beginPath()
        ctx.moveTo(0,0);
        ctx.strokeStyle = 'yellow';
        ctx.lineTo(this.a, 0);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath()
        ctx.moveTo(0,0);
        ctx.strokeStyle = 'green';
        ctx.lineTo(0,this.c);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath()
        ctx.moveTo(this.a,0);
        ctx.strokeStyle = 'orange';
        ctx.lineTo(0,this.c);
        ctx.closePath();
        ctx.stroke();

        if(this.c<0){
            ctx.rotate(-this.angle);
        }else{
            ctx.rotate(this.angle);
        }
        ctx.fillStyle = 'black';
        //ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
        ctx.fillRect(0,0,2000,1);
        
        ctx.restore();

    }
}

module.exports = TestTowerCase;