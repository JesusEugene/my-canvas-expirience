/**
 * Глвный объект игры
 * @function initialization() - иницифализация объекта
 * @function onEnable() - вызывается при включении объекта
 * @function onDisable() - вызывается при выключении объекта
 * @function update(deltatime) - обновление объекта логики
 * @function draw(ctx) - отрисовка объекта
 * @function addChild() - добавление дочернего объекта
 * @functiom addChildren(array) - добавление массива дочерних объектов
 */
class GameObject {
    constructor() {
        GameObject.objects.push(this);
        GameObject.notInitialized.unshift(this);
        GameObject.num++;

        this.__isInit = false;
        this.__isEnabled = true;

        this.__children = [];
        this.__father = null;

        this.__zIndex = 0;
        this.__changeZIndex(this.__zIndex);
    }

    /**
     * Вызывает функцию initialization()
     * @private
     */
    __init() {
        console.log("init");
        this.initialization();
        this.__isInit = true;
        GameObject.notInitialized.splice(
            GameObject.notInitialized.indexOf(this),
            1
        );
    }
    /**
     * Метод активации объекта и его детей
     * @private
     */
    __enable() {
        this.onEnable();
        this.__isEnabled = true;
        this.__children.forEach((child) => {
            child.enable();
        });
    }
    /**
     * Метод деактивации объекта и его детей
     * @private
     */
    __disable() {
        this.onDisable();
        this.__isEnabled = false;
        this.__children.forEach((child) => {
            child.disable();
        });
    }
    /**
     * Метод обновления логики объекта
     * @private
     * @param {*} deltaTime временная дельта
     *
     */
    __update(deltaTime) {
        this.update(deltaTime);
    }
    /**
     * Метод отрисовки объекта вызывается после update
     * @private
     * @param {*} ctx контекст отрисовки
     */
    __draw(ctx) {
        this.draw(ctx);
    }
    /**
     * Поменять zIndex
     * @private
     * @param {*} z zIndex
     */
    __changeZIndex(z) {
        /**
         * Добавить в список
         */
        if (GameObject.zIndexDict["" + z] === undefined) {
            GameObject.zIndexDict["" + z] = [this];
        } else if (GameObject.zIndexDict["" + z].indexOf(this) === -1) {
            GameObject.zIndexDict["" + z].push(this);
        }

        // Удаляем объект из старого zIndexDict
        if (
            this.__zIndex != z &&
            GameObject.zIndexDict["" + this.__zIndex].indexOf(this) !== -1
        ) {
            GameObject.zIndexDict["" + this.__zIndex].splice(
                GameObject.zIndexDict["" + this.__zIndex].indexOf(this),
                1
            );
        }
        this.__zIndex = z;
    }

    initialization() {}
    onEnable() {}
    onDisable() {}
    update(deltaTime) {}
    draw(ctx) {}

    /**
     * Вернуть zIndex
     */
    get zIndex() {
        return this.__zIndex;
    }
    /**
     * Установить zIndex
     */
    set zIndex(z) {
        this.__changeZIndex(z);
    }

    /**
     * Добавить ребенка в контейнер
     * @param {*} child ребенок
     */
    addChild(child) {
        child.__father = this;
        this.__children.push(child);
    }

    /**
     * Метод добавления детей в список объектов
     * @param {*} __children список детей
     * @memberof GameObject
     */
    addChildren(__children) {
        __children.forEach((child) => {
            child.__father = this;
            this.__children.push(child);
        });
    }
    clone() {
        let clone = Object.assign(this, this.x, this.y);
        console.log(clone === this);
        return clone;
    }
    delete() {
        GameObject.deleteList.push(this);
    }
    __delete() {
        GameObject.deleteList.splice(GameObject.deleteList.indexOf(this), 1);
        if (this.__father != null) {
            this.__father.__children.splice(
                this.__father.__children.indexOf(this),
                1
            );
        }
        GameObject.objects.splice(GameObject.objects.indexOf(this), 1);
        GameObject.zIndexDict["" + this.__zIndex].splice(
            GameObject.zIndexDict["" + this.__zIndex].indexOf(this),
            1
        );
        GameObject.num--;
    }
}

GameObject.objects = [];
GameObject.zIndexDict = {};
GameObject.num = 0;
GameObject.notInitialized = [];
GameObject.deleteList = [];
GameObject.deepClone = (obj) => {
    const clObj = {};
    for (const i in obj) {
        if (obj[i] instanceof Object) {
            clObj[i] = GameObject.deepClone(obj[i]);
            continue;
        }
        clObj[i] = obj[i];
    }
    return clObj;
};

module.exports = GameObject;
