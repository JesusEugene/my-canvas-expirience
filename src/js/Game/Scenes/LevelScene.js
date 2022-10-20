const Position = require("../../System/Structures/Position");
const Size = require("../../System/Structures/Size");
const Scale = require("../../System/Structures/Scale");
const Rect = require("../../System/Structures/Rect");
const Button = require("../../System/UI/Button");
const Scene = require("../../System/Scene");
const Tower = require("../Tower");
const Grid = require("../Grid");
const Enemy = require("../Enemy");

class LevelScene extends Scene {
    constructor() {
        super("level1");
        this.grid = new Grid(64, 64);
        this.towerPoses = [
            new Position(64 * 1, 64 * 0),
            new Position(64 * 2, 64 * 2),
            new Position(64 * 5, 64 * 2),
            new Position(64 * 5, 64 * 5),
            new Position(64 * 8, 64 * 1),
            new Position(64 * 9, 64 * 3),
            new Position(64 * 11, 64 * 6),
            new Position(64 * 13, 64 * 4),
        ];
        this.towers = [];
        this.towerPoses.forEach((pos) => {
            this.towers.push(new Tower(pos));
        });
        this.button = new Button(
            "<",
            new Rect(
                new Position(0, 0),
                new Size(256, 128),
                new Scale(0.1, 0.2)
            ),
            "button",
            "20px Verdana",
            "black",
            () => {
                window.game.setScene("Levels");
            }
        );

        this.enemy = new Enemy(new Position(0, 0), this.grid);

        this.addChild(this.grid);
        this.addChilds(this.towers);
        this.addChild(this.button);
        this.addChild(this.enemy);
        this.disable();
    }
}

module.exports = LevelScene;
