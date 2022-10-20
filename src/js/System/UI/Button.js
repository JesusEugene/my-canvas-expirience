const GameObject = require("../GameObject");
const Image = require("../Graphics/Image");
const Rect = require("../Structures/Rect");
const Position = require("../Structures/Position");
const Size = require("../Structures/Size");
const Scale = require("../Structures/Scale");
const Sprite = require("../Graphics/Sprite");
const Text = require("../Graphics/Text");
const MouseHandler = require("../InputHandlers/MouseHandler");

class Button extends GameObject {
    /**
     * @param  {} text текст кноки
     * @param  {} rect - позиция и размер кнопки
     * @param  {} name - имя спрайта
     * @param  {} font  - шрифт
     * @param  {} color - цвет текста
     */
    constructor(text, rect, name, font = "20px Arial", color = "black", onClick = () => {}, onMouseMove = () => {}) {
        super();
        /**
         * * Важные переменные
         */
        this.rect = rect;
        this.pos = rect.pos;
        this.size = rect.size;
        this.scale = rect.scale;
        this.src = name;
        this.font = font;
        this.color = color;

        // * Ивенты которые для кнопки
        this.onClick = onClick;
        this.onMouseMove = onMouseMove;

        /**
         * * Изменить положение картинки относительно начала координат
         * TODO: понять как сделать так чтобы не было такого
         */
        this.rect.Anchor = 5;

        /**
         * * Картинка идет на 2 спрайта
         */
        this.image = new Image(this.src, this.rect, {
            x: 0,
            y: 0,
            w: 256,
            h: 128,
            maxFrame: 2,
        });

        /**
         * * Создание спрайта
         * ? зачем мне спрайт?
         */
        this.sprite = new Sprite(this.image);

        /**
         * * Создание текста на картинке
         */
        this.text = new Text(
            text,
            new Rect(new Position(this.pos.x, this.pos.y), new Size(this.size.width, this.size.height), this.scale),
            this.font,
            this.color
        );

        /**
         * Добавление объектов в список чилдов
         */
        this.addChild(this.image);
        this.addChild(this.sprite);
        this.addChild(this.text);

        /**
         * * Добавление обработчиков событий
         */
        MouseHandler.onmousedownCallbacks.push(this.click.bind(this));
        MouseHandler.onmousemoveCallbacks.push(this.mouseMove.bind(this));
    }

    onDisable() {
        this.image.toFrameX(0);
    }

    /**
     * Проверка на нажатие по кнопке
     * @param {*} e дефолтный вывод ивента обработки мыши
     * @returns
     */
    isClick(e) {
        let xy = window.windowToCanvas(e.clientX, e.clientY);
        return (
            xy.x > this.pos.x &&
            xy.x < this.pos.x + this.size.width * this.scale.x &&
            xy.y > this.pos.y &&
            xy.y < this.pos.y + this.size.height * this.scale.y
        );
    }
    /**
     * Функция которая вызовется при наведении на кнопку
     * @param {*} e дефолтный вывод ивента обработки мыши
     * @returns
     */
    mouseMove(e) {
        if (!this.isEnabled) return;

        if (this.isClick(e)) {
            this.onMouseMove();
            this.image.toFrameX(1);
        } else {
            this.image.toFrameX(0);
        }

        // console.log(this.image.x)
    }
    /**
     * Функция которая вызовется при нажатии на кнопку
     * @param {*} e дефолтный вывод ивента обработки мыши
     */
    click(e) {
        if (!this.isEnabled) return;

        if (this.isClick(e)) {
            this.onClick();
        }
    }
}

module.exports = Button;
