const Position = require("./Position");
const Size = require("./Size");
class Rect extends window.GameObject {
    /**
     * Класс для работы с позицией объекта в 2д пространстве
     * @param  {Position} pos - позиция объекта
     * @param  {Size} size - размер объекта
     * @param  {Scale} scale - скалирование объекта
     * @param  {number} angle=0 - угол поворота объекта
     * @param  {number} anchor=1 - точка привязки объекта
     * @param  {number} anchorAngle=5 - точка привязки угла поворота объекта
     */
    constructor(
        pos,
        size,
        scale = { x: 1, y: 1 },
        angle = 0,
        anchor = 1,
        anchorAngle = 5
    ) {
        super();
        this.pos = pos;
        this.size = size;
        this.anchor = anchor;
        this.anchorAngle = anchorAngle;
        this.angle = angle;
        this.scale = scale;
        let xy = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.offset = new Position(this.size.width / 2, this.size.height / 2);
        this.offsetAngle = new Position(
            -this.size.width / 2,
            -this.size.height / 2
        );
        this.changeOffset();
        this.changeOffsetAngle();
        this.debug = false;
        this.setZIndex(10);
    }
    get Anchor() {
        return this.anchor;
    }

    set Anchor(value) {
        this.anchor = value;
        this.changeOffset();
    }

    get AnchorAngle() {
        return this.anchorAngle;
    }
    set AnchorAngle(value) {
        this.anchorAngle = value;
        this.changeOffsetAngle();
    }

    setPosition(pos) {
        this.pos = pos;
    }

    initialization() {}
    update(deltaTime) {}

    changeOffset() {
        let rs = this.getRealSize();
        if (this.anchor == 1) {
            this.offset = new Position(0, 0);
        } else if (this.anchor == 2) {
            this.offset = new Position(rs.width / 2, 0);
        } else if (this.anchor == 3) {
            this.offset = new Position((rs.width / 2) * 2, 0);
        } else if (this.anchor == 4) {
            this.offset = new Position(0, rs.height / 2);
        } else if (this.anchor == 5) {
            this.offset = new Position(rs.width / 2, rs.height / 2);
        } else if (this.anchor == 6) {
            this.offset = new Position((rs.width / 2) * 2, rs.height / 2);
        } else if (this.anchor == 7) {
            this.offset = new Position(0, (rs.height / 2) * 2);
        } else if (this.anchor == 8) {
            this.offset = new Position(rs.width / 2, (rs.height / 2) * 2);
        } else if (this.anchor == 9) {
            this.offset = new Position((rs.width / 2) * 2, (rs.height / 2) * 2);
        }
    }

    changeOffsetAngle(anchorAngle) {
        let rs = this.getRealSize();
        if (this.anchorAngle == 1) {
            this.offsetAngle = new Position(0, 0);
        } else if (this.anchorAngle == 2) {
            this.offsetAngle = new Position(-rs.width / 2, 0);
        } else if (this.anchorAngle == 3) {
            this.offsetAngle = new Position((-rs.width / 2) * 2, 0);
        } else if (this.anchorAngle == 4) {
            this.offsetAngle = new Position(0, -rs.height / 2);
        } else if (this.anchorAngle == 5) {
            this.offsetAngle = new Position(-rs.width / 2, -rs.height / 2);
        } else if (this.anchorAngle == 6) {
            this.offsetAngle = new Position(
                (-rs.width / 2) * 2,
                -rs.height / 2
            );
        } else if (this.anchorAngle == 7) {
            this.offsetAngle = new Position(0, (-rs.height / 2) * 2);
        } else if (this.anchorAngle == 8) {
            this.offsetAngle = new Position(
                -rs.width / 2,
                (-rs.height / 2) * 2
            );
        } else if (this.anchorAngle == 9) {
            this.offsetAngle = new Position(
                (-rs.width / 2) * 2,
                (-rs.height / 2) * 2
            );
        }
    }
    getCenter() {
        return new Position(
            this.pos.x + (this.size.width * this.scale.x) / 2,
            this.pos.y + (this.size.height * this.scale.y) / 2
        );
    }
    getAbsolutePosition() {
        return new Position(
            this.pos.x + this.offset.x,
            this.pos.y + this.offset.y
        );
    }
    getRealSize() {
        return new Size(
            this.size.width * this.scale.x,
            this.size.height * this.scale.y
        );
    }
    draw(ctx) {
        if (this.debug) {
            ctx.save();
            //ctx.font = "20px Arial";
            //ctx.fillText('anchor: '+this.anchor+' offsetAngle: '+this.anchorAngle,100,100);
            ctx.translate(this.pos.x, this.pos.y);
            //ctx.rotate(this.angle * Math.PI / 180);
            ctx.strokeStyle = "black";

            ctx.beginPath();
            ctx.rect(
                0,
                0,
                this.size.width * this.scale.x,
                this.size.height * this.scale.y
            );
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";
            ctx.arc(this.offset.x, this.offset.y, 3, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            ctx.stroke();

            ctx.restore();
        }
    }
}

module.exports = Rect;
