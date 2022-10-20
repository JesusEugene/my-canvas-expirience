const GameObject = require("./GameObject");

class Scene extends GameObject {
    //static scenes = [];
    /**
     * Класс сцены
     * @param  {string} name - имя сцены
     */
    constructor(name) {
        super();
        this.name = name;
        console.log("Scene constructor");
    }
    initialization() {
        console.log("Scene initialization");
    }
}

module.exports = Scene;
