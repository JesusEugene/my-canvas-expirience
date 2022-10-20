class MouseHandler {
    constructor() {
        this.canvas = window.canvas;

        canvas.onmousemove = (e) => {
            MouseHandler.onmousemoveCallbacks.forEach((callback) => {
                callback(e);
            });
        };
        canvas.onmousedown = (e) => {
            MouseHandler.onmousedownCallbacks.forEach((callback) => {
                callback(e);
            });
        };
        canvas.onmouseup = (e) => {
            MouseHandler.onmouseupCallbacks.forEach((callback) => {
                callback(e);
            });
        };
        canvas.onclick = (e) => {
            MouseHandler.onclickCallbacks.forEach((callback) => {
                callback(e);
            });
        };
        canvas.ondblclick = (e) => {
            MouseHandler.ondblclickCallbacks.forEach((callback) => {
                callback(e);
            });
        };
        canvas.onmouseover = (e) => {
            MouseHandler.onmouseoverCallbacks.forEach((callback) => {
                callback(e);
            });
        };
        canvas.onmouseout = (e) => {
            MouseHandler.onmouseoutCallbacks.forEach((callback) => {
                callback(e);
            });
        };
    }

    static geMousePositionInCanvas(e) {
        const cvs = window.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - cvs.left) * (window.canvas.width / cvs.width),
            y: (e.clientY - cvs.top) * (window.canvas.height / cvs.height),
        };
    }

    static addOnClickEvent(callback) {
        MouseHandler.onclickCallbacks.push(callback);
    }
    static addOnMouseMoveEvent(callback) {
        MouseHandler.onmousemoveCallbacks.push(callback);
    }
    static addOnMouseDownEvent(callback) {
        MouseHandler.onmousedownCallbacks.push(callback);
    }
    static addOnMouseUpEvent(callback) {
        MouseHandler.onmouseupCallbacks.push(callback);
    }
    static addOnMouseOverEvent(callback) {
        MouseHandler.onmouseoverCallbacks.push(callback);
    }
    static addOnMouseOutEvent(callback) {
        MouseHandler.onmouseoutCallbacks.push(callback);
    }
    static addOnDblClickEvent(callback) {
        MouseHandler.ondblclickCallbacks.push(callback);
    }
}
/**
 * * onmousedown - когда нажата кнопка мыши и еще не отпущена
 * * onmouseup - когда отпускаем кнопку мыши
 * * onclick - комбинация onmousedown и onmouseup
 * * ondblclick - двойной кик
 * * onmousemove когда двигаем мышь
 * * onmouseover когда мышь наводится на элемент
 * * onmouseout когда мышь уходит с элемента
 */
MouseHandler.onmousedownCallbacks = [];
MouseHandler.onmouseupCallbacks = [];
MouseHandler.onclickCallbacks = [];
MouseHandler.ondblclickCallbacks = [];
MouseHandler.onmousemoveCallbacks = [];
MouseHandler.onmouseoverCallbacks = [];
MouseHandler.onmouseoutCallbacks = [];

module.exports = MouseHandler;
