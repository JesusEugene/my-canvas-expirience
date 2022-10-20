class Image extends window.GameObject {
    /**
     * @param  {} name - название картинки
     * @param  {} rect - прмоугольник с привязками
     * @param  {{w,h,x,y,maxFrame}} frameData - данные для анимации
     */
    constructor(
        name,
        rect,
        frameData = {
            w: rect.size.width,
            h: rect.size.height,
            x: 0,
            y: 0,
            maxFrame: 1,
        }
    ) {
        super();
        this.name = name;
        this.rect = rect;
        this.frameData = frameData;
        this.absolutePosition = this.rect.getAbsolutePosition();
        this.isDebug = false;
    }

    initialization() {
        this.image = window.assetManager.getAsset(this.name);
    }

    draw(ctx) {
        //console.log(this.rect)
        ctx.save();

        //console.log(  'tmp',tmp)
        ctx.translate(this.absolutePosition.x, this.absolutePosition.y);
        ctx.rotate((this.rect.angle * Math.PI) / 180);
        if (this.isDebug) {
            ctx.strokeRect(
                this.rect.offsetAngle.x,
                this.rect.offsetAngle.y,
                this.rect.size.width * this.rect.scale.x,
                this.rect.size.height * this.rect.scale.y
            );
        }
        ctx.drawImage(
            this.image,
            this.frameData.x * this.frameData.w,
            this.frameData.y * this.frameData.h,
            this.frameData.w,
            this.frameData.h,
            this.rect.offsetAngle.x,
            this.rect.offsetAngle.y,
            this.rect.size.width * this.rect.scale.x,
            this.rect.size.height * this.rect.scale.y
        );
        ctx.restore();
    }

    /**
     * Сдедующий кадр анимации
     */
    nextFrame() {
        this.frameData.x++;
        if (this.frameData.x >= this.frameData.maxFrame) {
            this.frameData.x = 0;
        }
    }
    /**
     * Перейти к кадру по X
     * @param  {number} frameX Номер кадра начиная с 0
     */
    toFrameX(frameX) {
        this.frameData.x = frameX;
        if (this.frameData.x >= this.frameData.maxFrame) {
            this.frameData.x = 0;
        }
    }

    /**
     * Перейти к кадру по Y
     * @param  {} frameY Номер кадра начиная с 0
     */
    toFrameY(frameY) {
        this.frameData.y = frameY;
        if (this.frameData.y >= this.frameData.maxFrame) {
            this.frameData.y = 0;
        }
    }
}

module.exports = Image;
