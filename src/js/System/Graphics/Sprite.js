
class Sprite extends window.GameObject{
    /**
     * Конструктор спрайта
     * @param  {Image} img - изображение
     */
    constructor(img) {
        super();
        this.image = img;
        this.rect = img.rect;
        
    }

    initialization(){
        
    }
    draw(ctx) {
    
    }
}

module.exports = Sprite;