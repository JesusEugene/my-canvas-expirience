const GameObject = require("./System/GameObject");
const Game = require("./System/Game");

const ImageManager = require("./System/ImageManager");
const MouseHandler = require("./System/InputHandlers/MouseHandler");
const KeyboardHandler = require("./System/InputHandlers/KeyboardHandler");

/**
 * * Функция выполнится при загрузке страницы
 */
function loadGame() {
    const canvas = document.querySelector("#canvas");
    window.canvas = canvas;

    const ctx = canvas.getContext("2d");

    canvas.width = 128 * 8;
    canvas.height = 128 * 5;

    let isLoaded = false;
    const assets = [
        { name: "button", src: "./src/assets/button.png" },
        { name: "tower_01", src: "./src/assets/Towers/tower_blue.png" },
        { name: "turret_01_1", src: "./src/assets/Turrets/turret_01_mk1.png" },
        { name: "turret_01_2", src: "./src/assets/Turrets/turret_01_mk2.png" },
        { name: "turret_01_3", src: "./src/assets/Turrets/turret_01_mk3.png" },
        { name: "turret_01_4", src: "./src/assets/Turrets/turret_01_mk4.png" },
        { name: "turret_02_1", src: "./src/assets/Turrets/turret_02_mk1.png" },
        { name: "turret_02_2", src: "./src/assets/Turrets/turret_02_mk2.png" },
        { name: "turret_02_3", src: "./src/assets/Turrets/turret_02_mk3.png" },
        { name: "turret_02_4", src: "./src/assets/Turrets/turret_02_mk4.png" },
        { name: "terrain", src: "./src/assets/Terrains/terrain.png" },
        { name: "tank_01", src: "./src/assets/body_tracks.png" },
        { name: "halftrack", src: "./src/assets/body_halftrack.png" },
    ];

    const game = new Game();
    const mh = new MouseHandler();
    const kh = new KeyboardHandler();

    GameObject.game = game;

    /**
     * * РАБОЧАЯ ЗОНА
     */

    let imgManager = loadImages(assets, () => {
        game.initialization();
        isLoaded = true;
    });

    window.windowToCanvas = (x, y) => {
        const bbox = canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height),
        };
    };

    var lastTime = 0;
    let interval = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        interval += deltaTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (isLoaded) {
            if (interval >= 0) {
                interval = 0;
                //console.log("tick");
                //console.log(canvas.width);
                game.update(deltaTime);
                //  window.Animation.deltaTime = deltaTime;
                game.draw(ctx);
            }
        }
        requestAnimationFrame(animate);
    }

    animate(0);
}

/**
 * * Позволяет загрузить все картинки
 * @param {Array} assets Массив с объектами картинок
 * @param {Function} callback Функция которая выполнится после загрузки всех картинок
 */
function loadImages(assets, callback) {
    console.log("Loading images...");
    const imgManager = new ImageManager();
    assets.forEach((asset) => {
        imgManager.queueDownload(asset.name, asset.src);
    });
    // Загружаем ресурсы по окончанию вызываем функцию load
    imgManager.downloadAll(() => {
        console.log(
            "Images loaded!",
            "success count:",
            imgManager.successCount,
            "error count",
            imgManager.errorCount
        );
        console.log("Assets cache", imgManager.cache);
        callback();
    });

    return imgManager;
}

window.addEventListener("load", loadGame);

/**
 * * Пайплайн игры
 * * 1. Загрузка картинок
 */
