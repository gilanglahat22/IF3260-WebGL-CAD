export const getCoords = (canvas, event) => {
    const rectangle = canvas.getBoundingClientRect();

    const xCoord = event.clientX - rectangle.left;
    const yCoord = event.clientY - rectangle.top;

    const width = rectangle.width;
    const height = rectangle.height;

    console.log(width, height);
    
    return {
        x : 2 * (xCoord / width) - 1,
        y : 1 - 2 * (yCoord / height)
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