const Image = require("./Image");

class Animation {
    // * Список всех анимаций

    /**
     * Конструктор анимации
     * @param {string} name название анимации
     * @param {Image} image объект Image
     */
    constructor(name, image) {
        this.name = name;
        this.image = image;
        this.timer = 0;
        this.fps = 30;
        this.interval = 1000 / this.fps;
    }

    /**
     * проигрывать анимацию
     */
    play() {
        console.log(this.image.rect.frameData);
        if (this.timer > this.interval) {
            this.image.nextFrame();
            this.timer = 0;
        } else {
            this.timer += Animation.deltaTime;
        }
    }
    /**
     * Остановить анимацию
     */
    stop() {
        this.image.toFrameX(0);
    }
}

Animation.animations = [];

Animation.deltaTime = 0;

/**
 * Добавить анимацию
 * @param {*} name  имя анимации
 *  @param {Image} image объект Image
 */
Animation.addAnimation = (name, image) => {
    Animation.animations.push(new Animation(name, image));
};
/**
 * Получить анимацию по имени
 * @param {string} name имя анимации
 * @returns Animation
 */
Animation.getAnimationByName = (name) => {
    return Animation.animations.find((a) => a.name === name);
};

module.exports = Animation;
