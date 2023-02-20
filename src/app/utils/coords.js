const getCoords = (canvas, event) => {
    const rectangle = canvas.getBoundingClientRect();

    const xCoord = event.clientX - rectangle.left;
    const yCoord = event.clientY - rectangle.top;

    const width = rectangle.width;
    const height = rectangle.height;
    return {
        x : (2 * (xCoord / width) - 1),
        y : (1 - 2 * (yCoord / height))
    }
}

const getPoint = (x, y, onclick = false) => {
    const color = onclick ? 1.0 : 0.5
    const dist = 0.01
    const vertices = {
        position: [
            x - dist, y + dist, 
            x + dist, y + dist, 
            x + dist, y - dist, 
            x - dist, y - dist, 
        ],
        color: Array(16).fill(color),
    }
    return vertices;
}