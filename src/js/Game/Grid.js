const Sprite = require("../System/Graphics/Sprite");
const Image = require("../System/Graphics/Image");
const Position = require("../System/Structures/Position");
const Size = require("../System/Structures/Size");
const Scale = require("../System/Structures/Scale");
const Rect = require("../System/Structures/Rect");

class Grid extends window.GameObject {
    constructor(w, h) {
        super();
        this.width = w;
        this.height = h;

        this.MaxX = 16;
        this.MaxY = 10;

        this.frameX = 0;
        this.frameY = 1;
        this.Grids = [
            0, 1, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 6, 0, 0, 0, 0, 0, 5, 4, 6, 0, 0, 0, 0, 0, 0, 0,
            3, 0, 5, 4, 4, 4, 11, 2, 3, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 0, 0, 0, 3, 1, 3, 0, 0, 0, 0, 0, 1, 0, 8, 4, 7, 0,
            0, 0, 3, 2, 3, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 3, 2, 3, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 0,
            3, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 3, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 10, 7, 0, 0, 0,
            0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 3, 0, 1, 0, 0,
        ];
        this.movePoints = [
            { x: 0, y: 1, d: 0 },
            { x: 4, y: 1, d: -90 },
            { x: 4, y: 4, d: 0 },
            { x: 6, y: 4, d: -90 },
            { x: 6, y: 2, d: -180 },
            { x: 10, y: 2, d: -90 },
        ];

        this.sprites = [];

        this.isGridDraw = false;
        this.isNumDraw = false;
        this.images = [];

        for (let i = 0; i < this.MaxY; i++) {
            for (let j = 0; j < this.MaxX; j++) {
                let img = new Image(
                    "terrain",
                    new Rect(
                        new Position(j * this.width, i * this.height),
                        new Size(this.width, this.height),
                        new Scale(1, 1),
                        0,
                        5
                    ),

                    { w: 128, h: 128, x: this.Grids[j + i * 16], y: 0 }
                );
                this.images.push(img);

                this.sprites.push(new Sprite(img));
            }
        }
        this.setZIndex(1);
        this.addChilds(this.images);
        this.addChilds(this.sprites);
    }

    initialization() {}

    update(deltaTime) {}
    draw(ctx) {
        for (let i = 0; i < this.MaxY; i++) {
            for (let j = 0; j < this.MaxX; j++) {
                if (this.isGridDraw) {
                    ctx.beginPath();
                    ctx.rect(j * this.width, i * this.height, this.width, this.height);
                    ctx.closePath();
                    ctx.stroke();
                }

                if (this.isNumDraw) {
                    ctx.fillStyle = "black";
                    ctx.font = "20px Arial";
                    ctx.fillText("" + j + ";" + i, j * this.width, i * this.height + 64);
                }
            }
        }
    }
}

module.exports = Grid;
