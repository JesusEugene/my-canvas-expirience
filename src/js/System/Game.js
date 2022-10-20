const GameObject = require("./GameObject");

const MainScene = require("./MenuScene");

class Game {
    constructor() {
        this.scene = new MainScene("MainScene");
    }

    initialization() {
        while (GameObject.notInitialized.length > 0) {
            GameObject.notInitialized[0].__init();
        }
    }

    update(deltaTime) {
        //onsole.log(this.Tower);
        while (GameObject.notInitialized.length > 0) {
            GameObject.notInitialized[0].__init();
        }
        while (GameObject.deleteList.length > 0) {
            GameObject.deleteList[0].__delete();
        }
        // Обновление логики всех объектов
        for (let item in GameObject.zIndexDict) {
            GameObject.zIndexDict[item].forEach((object) => {
                if (object.__isEnabled && object.__isInit)
                    object.__update(deltaTime);
            });
        }
    }
    draw(ctx) {
        // Отрисовка всех объектов в зависимости от индекса
        for (let item in GameObject.zIndexDict) {
            GameObject.zIndexDict[item].forEach((object) => {
                if (object.__isEnabled && object.__isInit) object.__draw(ctx);
            });
        }
    }
}

module.exports = Game;
