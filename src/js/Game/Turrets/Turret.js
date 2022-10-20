const Sprite = require("../../System/Graphics/Sprite.js");
const Image = require("../../System/Graphics/Image.js");
const Rect = require("../../System/Structures/Rect.js");
const Position = require("../../System/Structures/Position.js");
const Size = require("../../System/Structures/Size.js");
const Scale = require("../../System/Structures/Scale.js");

class Turret extends window.GameObject {
    constructor(pos) {
        super();
        this.pos = pos;
        // * Название картинки
        this.imgName = "turret_01_1";
        // * Размер картинки
        this.width = 64;
        this.height = 64;
        // * Rect спрайта
        this.spriteRect = new Rect(
            this.pos,
            new Size(this.width, this.height),
            new Scale(1, 1),
            0,
            5
        );
        this.frameData = {
            x: 0,
            y: 0,
            w: 128,
            h: 128,
            maxFrame: 7,
        };
        // * угол и сдвиг для корректного поворота
        this.angle = 0;
        this.angleOffset = -1.57;

        // * значения для работы с треугольником
        this.a = 0;
        this.b = 0;
        this.c = 0;

        this.isShot = false;
        this.target = null;
        this.dmg = 0.1;
        this.r = 250;
    }

    initialization() {
        this.image = new Image(this.imgName, this.spriteRect, this.frameData);

        this.sprite = new Sprite(this.image);

        this.addChild(this.image);
        this.addChild(this.sprite);

        window.Animation.addAnimation("turret01_1_shooting", this.image);
        this.anim = window.Animation.getAnimationByName("turret01_1_shooting");
    }
    lookAt(x, y) {
        this.a = x - this.pos.x;
        this.c = y - this.pos.y;
        this.b = Math.sqrt(this.a * this.a + this.c * this.c);
        this.angle = Math.acos(this.a / this.b) - this.angleOffset;
    }
    update(deltaTime) {
        if (this.isShot || this.image.frameData.x != 0) {
            if (this.target != null) this.target.health -= this.dmg;
            this.anim.play();
        } else {
            this.anim.stop();
        }

        if (this.c < 0) {
            this.image.rect.angle = ((3.14 - this.angle) * 180) / Math.PI;
        } else {
            this.image.rect.angle = (this.angle * 180) / Math.PI;
        }

        for (let i = 0; i < window.game.enemyArray.length; i++) {
            let enemy = window.game.enemyArray[i];
            if (
                Math.sqrt(
                    Math.pow(enemy.x + enemy.width / 2 - this.pos.x, 2) +
                        Math.pow(enemy.y + enemy.height / 2 - this.pos.y, 2)
                ) < this.r
            ) {
                this.isShot = true;
                this.target = enemy;
                this.lookAt(enemy.x, enemy.y);
                return;
            } else {
                this.isShot = false;
            }
        }
        this.isShot = false;
    }
    draw(ctx) {
        ctx.save();
        let axy = this.image.rect.getAbsolutePosition();
        ctx.translate(axy.x, axy.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, Math.PI * 2, false);
        //fill green color with a = 0.25
        ctx.fillStyle = "rgba(0, 255, 0, 0.25)";
        ctx.fill();
        ctx.closePath();
        ctx.stroke();

        //this.anim.draw(ctx);
        ctx.restore();
    }
}

module.exports = Turret;
