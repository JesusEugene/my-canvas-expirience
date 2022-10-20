const Turret = require("./Turret");
const Sprite = require("../../System/Graphics/Sprite");
const Animation = require("../../System/Graphics/Animation");
const Rect = require("../../System/Structures/Rect");
const Position = require("../../System/Structures/Position");
const Size = require("../../System/Structures/Size");
const Scale = require("../../System/Structures/Scale");

class LaserGunTurret extends Turret {
    constructor(pos) {
        super(pos);
        this.pos = pos;
        this.imgName = "turret_02_1";

        this.width = 64;
        this.height = 64;

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
            maxFrame: 10,
        };
    }
}

module.exports = LaserGunTurret;
