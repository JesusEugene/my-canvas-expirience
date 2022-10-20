const Scene = require("./Scene");
const Grid = require("./Grid/Grid");
const Cell = require("./Grid/Cell");
const Tower = require("./Tower");
const TowerB = require("./towerB");
const MouseHandler = require("./InputHandlers/MouseHandler");
const GameObject = require("./GameObject");
const Enemy = require("./Enemy");
const Projectile = require("./Projectile");

class MenuScene extends Scene {
    constructor() {
        super();
        this.x = 0;
        this.y = 64 * 2;
        // grids
        this.grid = new Grid(this.x, this.y, 0, 16, 15, 6, 64, 64, false);
        this.gridMenu = new Grid(32, 32, 20, 0, 2, 1, 64, 64);
        //towers
        this.menuTowers = [new Tower(0, 0, 64, 64), new TowerB(0, 0, 64, 64)];
        this.towers = [];
        this.ghostTower = null;

        this.enemies = [];
        this.projectiles = [];

        this.tower = -1;
        this.pressTowerMenu = false;
        this.oldSelectedCell = null;
        this.selectedCell = null;

        this.timer = 0;
        this.timerShot = 0;
    }

    initialization() {
        let that = this;

        // * В меню добавить башни
        for (let i = 0; i < this.menuTowers.length; i++) {
            let cell = this.gridMenu.cells[i];
            this.menuTowers[i].x = cell.x;
            this.menuTowers[i].y = cell.y;
        }

        MouseHandler.addOnClickEvent((e) => {
            // * Позиция мыши на канвасе
            const mpos = MouseHandler.geMousePositionInCanvas(e);
            // * Работа с главной сеткой
            this.grid.cells.forEach((cell) => {
                if (Cell.collision(mpos, cell) && this.tower !== -1) {
                    // * Если мышка нажата на клетку и выбранна башня то бащню нужно поставить в клетку
                    let { x, y } = cell.getPosition();
                    // * Берем башню из призрака и ставим ее в клетку

                    if (
                        that.towers.findIndex(
                            (tower) => tower.x === x && tower.y === y
                        ) === -1
                    ) {
                        let tower = that.ghostTower;
                        tower.x = x;
                        tower.y = y;
                        that.tower = -1;
                        that.towers.push(tower);
                        cell.addChild(tower);
                    }

                    console.log(that.towers);
                }
            });

            // * Работа с сеткой меню
            this.gridMenu.cells.forEach((cell, index) => {
                if (Cell.collision(mpos, cell)) {
                    let { x, y } = cell.getPosition();
                    that.tower = index;
                    this.pressTowerMenu = true;
                }
            });
        });

        MouseHandler.addOnMouseMoveEvent((e) => {
            if (this.ghostTower !== null) {
                const mpos = MouseHandler.geMousePositionInCanvas(e);
                this.ghostTower.x = mpos.x - this.ghostTower.width / 2;
                this.ghostTower.y = mpos.y - this.ghostTower.height / 2;
                //let gPos = this.grid.getGridPosition(mpos);
                let cell = this.grid.getCellByPosition(mpos);
                if (cell) {
                    cell.isDrawing = !cell.isDrawing;
                }
            }
        });
    }

    update(deltaTime) {
        this.timer += deltaTime;
        this.timerShot += deltaTime;
        // * Логика для работы с призраком башни
        if (this.tower !== -1 && this.ghostTower === null) {
            // * Если выбранна вышка и нету призрака то создать призрака и добавить его в сцену
            this.ghostTower = this.menuTowers[this.tower].getTower();
            this.pressTowerMenu = false;
        } else if (this.tower !== -1 && this.pressTowerMenu) {
            // * Если вышка выбранна и кнопка нажата на меню то нужно поменять призрка
            // * Старый призрак удаляем и создаем новый
            this.ghostTower.delete();
            this.ghostTower = this.menuTowers[this.tower].getTower();
            this.pressTowerMenu = false;
        } else if (this.tower === -1) {
            // * Если вышка не выбранна то призрак удаляем
            this.ghostTower = null;
        }

        if (this.timer > 2000) {
            let r = Math.floor(Math.random() * 6);
            console.log(this.x + 76 * r);
            this.enemies.push(
                new Enemy(64 * 16, this.y + (64 + 16) * r, 64, 64, -0.5)
            );
            this.timer = 0;
        }
        this.enemies.forEach((enemy) => {
            let { x, y } = this.grid.getGridPosition(enemy);
            x = this.x + x * 64;
            y = this.y + y * (64 + 16);
            let tower = this.towers.find(
                (tower) => tower.x === x && tower.y === y
            );
            if (!tower) {
                enemy.run();
            }
            if (this.timerShot > 1000) {
                console.log(this.timerShot);
                let towers = this.towers.filter(
                    (tower) => tower.y === y && tower.x <= x
                );
                if (towers.length > 0) {
                    towers.forEach((tower) => {
                        this.projectiles.push(
                            new Projectile(tower.x, tower.y, 32, 32, 0.5)
                        );
                    });
                }
            }

            let i = 0;
            while (this.projectiles.length > i && this.projectiles.length > 0) {
                if (
                    this.projectiles[i].y === enemy.y &&
                    this.projectiles[i].x >= enemy.x
                ) {
                    enemy.health -= this.projectiles[i].damage;

                    this.projectiles[i].delete();
                    this.projectiles.splice(
                        this.projectiles.indexOf(this.projectiles[i]),
                        1
                    );
                    i--;
                }
                i++;
            }
            // console.log("s", tower);
        });
        let i = 0;
        while (this.enemies.length > i && this.enemies.length > 0) {
            if (this.enemies[i].health <= 0) {
                this.enemies.splice(this.enemies.indexOf(this.enemies[i]), 1);
                i--;
            }
            i++;
        }
        if (this.timerShot > 1000) {
            this.timerShot = 0;
        }
        console.log(this.projectiles);
        this.projectiles.forEach((projectile) => {
            if (projectile) projectile.run();
        });
    }
}

module.exports = MenuScene;
