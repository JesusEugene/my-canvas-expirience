const Scene = require("../../System/Scene");
const Background = require("../../System/Graphics/Background");
const Position = require("../../System/Structures/Position");
const Size = require("../../System/Structures/Size");
const TestCase = require("../../Game/TestCase");
const Button = require("../../System/UI/Button");
const Sprite = require("../../System/Graphics/Sprite");
const GameObject = require("../../System/GameObject");
const MouseHandler = require("../../System/InputHandlers/MouseHandler");
const Scale = require("../../System/Structures/Scale");
const Rect = require("../../System/Structures/Rect");

class MenuScene extends Scene {
    constructor() {
        super("Menu");

        this.b = new Button(
            "Уровни",
            new Rect(new Position(256, 100), new Size(256, 128), new Scale(2, 1)),
            "button",
            "60px Verdana",
            "black",
            () => {
                window.game.setScene("Levels");
            }
        );

        this.b2 = new Button(
            "Настройки",
            new Rect(new Position(256, 300), new Size(256, 128), new Scale(2, 1)),
            "button",
            "60px Verdana",
            "black",
            () => {
                console.log("b2 click");
            }
        );
        this.addChild(this.b);
        this.addChild(this.b2);
        this.disable();
    }
    // initialization(){
    //     this.objects.forEach(object=>{
    //         object.initialization();
    //     })
    // }
    // update(deltaTime) {
    //     this.objects.forEach(object=>{
    //         object.update(deltaTime);
    //     })
    // }

    // draw(ctx){
    //     this.objects.forEach(object=>{
    //         object.draw(ctx);
    //     })
    // }
}

module.exports = MenuScene;
