class KeyboardHandler {
    constructor() {
        this.canvas = window.canvas;

        canvas.onkeydown = (e) => {
            KeyboardHandler.onkeydownCallbacks.forEach((callback) => {
                callback(e);
            });
        };

        canvas.onkeyup = (e) => {
            KeyboardHandler.onkeyupCallbacks.forEach((callback) => {
                callback(e);
            });
        };

        canvas.onkeypress = (e) => {
            KeyboardHandler.onkeypressCallbacks.forEach((callback) => {
                callback(e);
            });
        };
    }
}

/**
 * * keydown - срабатывает при нажатии клавиши
 * * keyup - срабатывает при отпускании клавиши
 * * keypress - срабатывает между нажатии и отпускании клавиши
 */
KeyboardHandler.onkeydownCallbacks = [];
KeyboardHandler.onkeyupCallbacks = [];
KeyboardHandler.onkeypressCallbacks = [];

module.exports = KeyboardHandler;
