const Sprite = require("../System/Graphics/Sprite");
const LaserGunTurret = require("./Turrets/LaserGunTurret");
const MachineGunTurret = require("./Turrets/MachineGunTurret");
const Turret = require("./Turrets/Turret");
const Image = require("../System/Graphics/Image");
const Position = require("../System/Structures/Position");
const Size = require("../System/Structures/Size");
const Scale = require("../System/Structures/Scale");
const Rect = require("../System/Structures/Rect");
const MouseHandler = require("../System/InputHandlers/MouseHandler");

class Tower extends window.GameObject {
    constructor(pos) {
        super();
        this.imgName = "tower_01";
        this.width = 64;
        this.height = 64;
        this.pos = pos;
        this.x = pos.x;
        this.y = pos.y;
        this.turret = null;
        this.debug = false;

        this.isClick = false;
        this.image = new Image(
            this.imgName,
            new Rect(
                new Position(this.x, this.y),
                new Size(this.width, this.height),
                new Scale(1, 1),
                0,
                5
            ),
            { x: 0, y: 0, w: 92, h: 92, maxFrame: 1 }
        );
        this.sprite = new Sprite(this.image);

        this.addChilds([this.image, this.sprite]);
    }

    initialization() {
        MouseHandler.onmousedownCallbacks.push((e) => {
            let mouse = window.windowToCanvas(e.clientX, e.clientY);
            if (
                this.isEnabled &&
                mouse.x > this.x &&
                mouse.x < this.x + this.width &&
                mouse.y > this.y &&
                mouse.y < this.y + this.height
            ) {
                this.isClick = true;
            }
        });
    }

    update(deltaTime) {
        this.image.rect.x += 10;
        if (this.isClick && this.turret == null) {
            this.isClick = false;
            // math rendom 1 - 5

            let r = Math.floor(Math.random() * 2);
            this.turret =
                r == 1
                    ? new LaserGunTurret(this.pos)
                    : new MachineGunTurret(this.pos);
            this.addChild(this.turret);
        }
    }
}

module.exports = Tower;
