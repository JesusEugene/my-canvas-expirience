const Image = require("./Image");
const Rect = require("../../System/Structures/Rect");
const Position = require("../../System/Structures/Position");
const Size = require("../../System/Structures/Size");
const Scale = require("../../System/Structures/Scale");
const Animation = require("../../System/Graphics/Animation");

class AnimationsManager {
    constructor() {
        this.animations = [];
    }

    addAnimation(animation) {
        AnimationsManager.animations.push(animation);
    }

    getAnimationByName(name) {
        let s = AnimationsManager.animations.find(
            (animation) => animation.name === name
        );
        // console.log("s", s);
        // let rect = new Rect(
        //     new Position(s.image.rect.pos.x, s.image.rect.pos.y),
        //     new Size(s.image.rect.size.w, s.image.rect.size.h),
        //     new Scale(s.image.rect.scale.x, s.image.rect.scale.y),
        //     s.image.rect.anchor,
        //     s.image.rect.anchorAngle
        // );
        // console.log(rect);
        // let frameData = {
        //     w: s.image.frameData.w,
        //     h: s.image.frameData.h,
        //     x: s.image.frameData.x,
        //     y: s.image.frameData.y,
        // };

        // let clone = new Animation(
        //     s.name,
        //     new Image(s.image.name, rect, frameData)
        // );
        return s;
    }
}

AnimationsManager.animations = [];

module.exports = AnimationsManager;
