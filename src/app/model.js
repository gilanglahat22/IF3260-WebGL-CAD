import { renderObject, renderAllObjects } from "./_main.js";
import { getPoint } from "./utils/coords.js";

export class Model {
    constructor(vertices = [], vertexCount = 0, type = "LINE", color = [0.0, 1.0, 0.0, 1.0], completed = false, count = 2) {
        this.vertices = vertices;
        this.vertexCount = vertexCount;
        this.count = count;
        this.type = type;
        this.color = color;
        this.completed = completed;
    }

    draw(x, y){
        if (this.vertexCount < this.count) {
            let vertex = {
                position: [x, y],
                color: this.color
            }
            
            this.vertices.push(vertex);

            this.vertexCount++;

            if (this.vertexCount == this.count){
                this.completed = true;
            } 

            renderAllObjects();
        } 
        renderObject(this);
    }

    checkVertex(x, y){
        let index = 0;

        for (const vertex of this.vertices) {
            let point = getPoint(vertex.position[0], vertex.position[1]);

            let topRightX = point.position[2];
            let topRightY = point.position[3];
            
            let bottomLeftX = point.position[6];
            let bottomLeftY = point.position[7];

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

