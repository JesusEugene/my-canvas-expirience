
class Text extends window.GameObject{
    /**
     * Конструктор текста
     * @param  {Rect} pos - позиция текста
     * @param  {string} text - текст
     */
    constructor(text,rect,font="20px Aria",color="black") {
        super();
        this.text = text;
        this.rect = rect;
        
        this.rect.Anchor = 1;
        this.font = font;
        this.color = color;
        this.absolutePosition =  this.rect.getCenter()
        this.addChild(this.rect);
    }

    initialization(){
        
    }
    draw(ctx) {
        
        ctx.save()
        ctx.font = this.font;
        ctx.strokeStyle = this.color
        ctx.textBaseline ='middle';
        ctx.textAlign = "center";
        ctx.translate(this.absolutePosition.x,this.absolutePosition.y);

        ctx.fillText(this.text,0, 0)

        ctx.restore();
    }
}

module.exports = Text;