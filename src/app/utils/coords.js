export const getCoords = (canvas, event) => {
    const rectangle = canvas.getBoundingClientRect();
    return {
        x : event.clientX - rectangle.left,
        y : event.clientY - rectangle.top
    }
}