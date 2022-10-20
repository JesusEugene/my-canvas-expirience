const Sprite = require("../System/Graphics/Sprite");

const Image = require("../System/Graphics/Image");
const Position = require("../System/Structures/Position");
const Size = require("../System/Structures/Size");
const Scale = require("../System/Structures/Scale");
const Rect = require("../System/Structures/Rect");
const AnimationsManager = require("../System/Graphics/AnimationManager");

class Enemy extends window.GameObject {
    constructor(pos, grid) {
        super();
        this.am = new AnimationsManager();
        this.imageName = "halftrack";
        this.width = 64;
        this.height = 64;
        this.x = pos.x;
        this.y = pos.y;
        this.degree = -90;
        this.degreeOffset = 180;
        this.va = 5;
        this.nodePosition = null;
        this.speed = 2;
        this.health = 100;
        this.markerDelete = false;
        this.grid = grid;
        this.anim;
    }
    initialization() {
        this.movePoints = this.grid.movePoints;

        this.nodePosition = { x: 0, y: 1, d: -90, n: 3 };
        window.game.enemyArray.push(this);
        this.image = new Image(
            this.imageName,
            new Rect(
                new Position(-20, 0),
                new Size(128, 128),
                new Scale(1.5, 1.5),
                0,
                5
            ),
            {
                w: 128,
                h: 128,
                x: 0,
                y: 0,
                maxFrame: 2,
            }
        );
        let rect = new Rect(
            new Position(this.image.rect.pos.x + 200, this.image.rect.pos.y),
            new Size(this.image.rect.size.w, this.image.rect.size.h),
            new Scale(5, 5),
            this.image.rect.anchor,
            this.image.rect.anchorAngle
        );
        console.log(rect);
        let frameData = {
            w: this.image.frameData.w,
            h: this.image.frameData.h,
            x: this.image.frameData.x,
            y: this.image.frameData.y,
        };

        this.image2 = new Image("tower_01", rect, frameData);
        this.image.rect.debug = true;
        this.image2.rect.debug = true;
        console.log("sssss", this.image2, this.image2);
        this.sprite = new Sprite(this.image);
        this.addChild(this.image);
        this.addChild(this.image2);
        this.addChild(this.sprite);
        //this.am.addAnimation("run", this.image);
        // this.anim = window.Animation.getAnimationByName("halftrack_run");
        this.anim = this.am.getAnimationByName("run");
        //console.log(this.anim);
        //console.log(this.nodePosition);
    }

    logic(node) {
        var x = node.x,
            y = node.y,
            d = node.d,
            n = this.grid.Grids[this.grid.MaxX * y + x];
        var next;
        //console.log(n,node)
        if (x === this.grid.MaxX - 1 && y === this.grid.MaxY - 1) {
            return node;
        }
        if (n === 3) {
            if (node.n === 7) {
                next = { x: x, y: y - 1, d: d, n: 3 };
            } else {
                next = { x: x, y: y + 1, d: d, n: n };
            }
            node.next = next;
            return this.logic(next);
        } else if (n === 4) {
            next = { x: x + 1, y: y, d: d, n: n };
            node.next = next;
            return this.logic(next);
        } else if (n === 5) {
            next = { x: x + 1, y: y, d: d + 90, n: n };
            node.next = next;
            return this.logic(next);
        } else if (n === 6) {
            next = { x: x, y: y + 1, d: d + 90, n: n };
            node.next = next;
            return this.logic(next);
        } else if (n === 7) {
            if (node.n === 3) {
                next = { x: x - 1, y: y, d: d + 90, n: n };
            } else next = { x: x, y: y - 1, d: d - 90, n: n };
            node.next = next;
            return this.logic(next);
        } else if (n === 8) {
            next = { x: x + 1, y: y, d: d - 90, n: n };
            node.next = next;
            return this.logic(next);
        } else if (n === 9) {
        } else if (n === 10) {
            if (node.n === 8) {
                next = { x: x, y: y + 1, d: d + 90, n: n };
            } else if (node.n === 7) {
                next = { x: x, y: y + 1, d: d - 90, n: n };
            }
            node.next = next;
            return this.logic(next);
        } else if (n === 11) {
            var r = Math.floor(Math.random() * 2);
            if (r === 0) {
                next = { x: x, y: y + 1, d: d + 90, n: n };
            } else {
                next = { x: x, y: y - 1, d: d - 90, n: n };
            }
            node.next = next;
            return this.logic(next);
        }
    }

    moveToPoint(x, y) {
        if (this.x < x) {
            this.x += this.speed;
        } else if (this.x > x) {
            this.x -= this.speed;
        } else if (this.y < y) {
            this.y += this.speed;
        } else if (this.y > y) {
            this.y -= this.speed;
        }
    }

    rotateToDegree(degree) {
        if (this.degree < degree) {
            this.degree += this.va;
        } else if (this.degree > degree) {
            this.degree -= this.va;
        }
    }

    update(deltaTime) {
        // this.anim.play();
        // this.anim.play();
        if (this.health <= 0) {
            this.markerDelete = true;
        }

        if (
            this.movePoints.length > 0 &&
            this.movePoints[0].x * 64 === this.x &&
            this.movePoints[0].y * 64 === this.y
        ) {
            this.movePoints.shift();
        }
        if (this.movePoints.length > 0) {
            this.moveToPoint(
                this.movePoints[0].x * this.grid.width,
                this.movePoints[0].y * this.grid.height
            );
            this.rotateToDegree(this.movePoints[0].d);
        } else {
        }
        // this.image.rect.setPosition(new Position(this.x, this.y));
        //  this.image.absolutePosition = this.image.rect.getAbsolutePosition();
        // this.image.rect.angle = this.degree - this.degreeOffset;
        //console.log(this.degree);
        // this.anim.update(deltaTime);
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.fillStyle = "black";
        ctx.fillText(this.health, -15, -25);
        ctx.rotate((this.degree * Math.PI) / 180);
        //this.anim.draw(ctx);
        ctx.restore();
    }
}

module.exports = Enemy;
