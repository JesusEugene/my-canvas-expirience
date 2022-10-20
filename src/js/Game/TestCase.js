const GameObject = require('../System/GameObject');
const Rect = require('../System/Structures/Rect');
const Image = require('../System/Graphics/Image');
const Position = require('../System/Structures/Position');
const Size = require('../System/Structures/Size');
const Scale = require('../System/Structures/Scale');
class TestCase extends GameObject{
    constructor(pos,size){
        super();
        this.pos = pos;
        this.size = size;
        this.rect = new Rect(pos,new Size(128,128),new Scale(1.4,1.4),0,5,5);
        this.rect2 = new Rect(new Position(pos.x,pos.y),new Size(128,128),new Scale(1,1),0,1,5);
        
        this.image = new Image('tower_01', this.rect);
        this.inteval = 0;
        this.img = new Image('turret_01_1', this.rect2)
    }
    initialization(){
        
    }
    update(deltaTime){
        this.rect2.pos = this.rect.getAbsolutePosition()
        this.inteval += deltaTime;
        if(this.inteval>500){
            this.inteval = 0;
            this.rect.anchor+=1;
            
           // this.rect2.anchor+=1;
            if(this.rect.anchor>9){
                this.rect.anchor = 1;
                
                if(this.rect.anchorAngle>9){
                    this.rect.anchorAngle = 1;
                }
            }
            // if(this.rect2.anchor>9){
            //     this.rect2.anchor = 1;
            //     this.rect2.anchorAngle+=1;
            //     if(this.rect2.anchorAngle>9){
            //         this.rect2.anchorAngle = 1;
            //     }
            // }
            
        }
       // this.rect.angle +=0.5;
        this.rect2.angle +=0.5;
        
    }
    draw(ctx){
       
        //ctx.drawImage(this.image,this.pos.x,this.pos.y,this.size.width,this.size.height);
    }

}

module.exports = TestCase;