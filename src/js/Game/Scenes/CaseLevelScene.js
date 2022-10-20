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

class CaseLevelScene extends Scene {
    constructor() {
        super("Levels");
        this.backButton = new Button(
            "Назад",
            new Rect(
                new Position(0, 0),
                new Size(256, 128),
                new Scale(0.5, 0.5)
            ),
            "button",
            "20px Verdana",
            "black",
            () => {
                window.game.setScene("Menu");
            }
        );
        this.bLevels = [];
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 2; j++) {
                this.bLevels.push(
                    new Button(
                        1 + i + j * 7,
                        new Rect(
                            new Position(100 + 128 * i, 100 + 64 * j),
                            new Size(256, 128),
                            new Scale(0.3, 0.3)
                        ),
                        "button",
                        "20px Verdana",
                        "black",
                        () => {
                            window.game.setScene("level" + (1 + i + j * 7));
                        }
                    )
                );
            }
        }

        this.addChild(this.backButton);

        this.addChilds(this.bLevels);

        this.disable();
    }
}

module.exports = CaseLevelScene;
