export const getCoords = (canvas, event) => {
    const rectangle = canvas.getBoundingClientRect();
    return {
        x : parseFloat(event.clientX - rectangle.left),
        y : parseFloat(event.clientY - rectangle.top)
    }
}

export const getSquarePoint = (x, y) => {
    return [
        x-0.025, y+0.025, 1.0, 1.0, 1.0,
        x+0.025, y+0.025, 1.0, 1.0, 1.0,
        x+0.025, y-0.025, 1.0, 1.0, 1.0,
        x-0.025, y-0.025, 1.0, 1.0, 1.0
    ]
}