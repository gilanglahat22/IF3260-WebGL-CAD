import { renderObject, renderAllObjects } from "./_main.js";
import { getPoint } from "./utils/coords.js";

export class Line {
    constructor(vertices = [], vertexCount = 0, color = [0.0, 1.0, 0.0, 1.0], completed = false) {
        this.vertices = vertices;
        this.vertexCount = vertexCount;
        this.type = "line";
        this.color = color;
        this.completed = completed;
    }

    draw(x, y){
        if (this.vertexCount < 2) {
            let vertex = {
                position: [x, y],
                color: this.color
            }
            
            this.vertices.push(vertex);

            this.vertexCount++;

            if (this.vertexCount == 2){
                this.completed = true;
            } 

            renderAllObjects();
        } 
        renderObject(this);
    }

    checkCoords(x, y){
        let index = 0;

        for (const vertex of this.vertices) {
            let point = getPoint(vertex.position[0], vertex.position[1]);

            let topRightX = point.positions[2];
            let topRightY = point.positions[3];
            
            let bottomLeftX = point.positions[6];
            let bottomLeftY = point.positions[7];

            let left = Math.min(topRightX, bottomLeftX);
            let right = Math.max(topRightX, bottomLeftX);

            let bottom = Math.min(topRightY, bottomLeftY);
            let top = Math.max(topRightY, bottomLeftY);

            if (x >= left && x <= right && y >= bottom && y <= top){
                return index;
            }
            index++;
        }


        return -1
    }
}

