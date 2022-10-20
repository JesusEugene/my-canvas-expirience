/**
 * Менеджер ассетов
 */
class ImageManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = {};
        this.downloadQueue = [];
    }
    /**
     * Добавляет изображение в очередь загрузки
     * @param {*} path путь к файлу
     */
    queueDownload(name, path) {
        this.downloadQueue.push({ name: name, path: path });
    }
    /**
     *  Проверяет, все ли файлы загружены
     * @returns {boolean} true если все изображения загружены
     */
    isDone() {
        return this.downloadQueue.length == this.successCount + this.errorCount;
    }
    /**
     *  Загружает все изображения из очереди
     * @param {*} downloadCallback функция, которая вызывается после загрузки каждого изображения
     */
    downloadAll(downloadCallback) {
        for (var i = 0; i < this.downloadQueue.length; i++) {
            let img = new Image();
            let that = this;
            let path = this.downloadQueue[i].path;
            let name = this.downloadQueue[i].name;
            img.addEventListener("load", function () {
                //console.log("load", name);
                that.successCount++;
                if (that.isDone()) downloadCallback();
            });
            img.addEventListener("error", function () {
                console.log("error", name);
                that.errorCount++;
                if (that.isDone()) downloadCallback();
            });
            img.src = path;
            this.cache[name] = img;
        }
    }
    /**
     * Возвращает изображение по пути
     * @param {*} name путь к файлу
     * @returns
     */
    getAsset(name) {
        // if name is error that throw error
        if (name === undefined)
            throw new Error(`AssetManager.getAsset: name:${name} is undefined`);
        if (this.cache[name] === undefined)
            throw new Error(`AssetManager.getAsset: name:${name} is not found`);

        return this.cache[name];
    }
}

module.exports = ImageManager;
