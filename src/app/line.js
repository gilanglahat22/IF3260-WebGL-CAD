import { loadObject, renderAllObjects } from "./_main.js";


export class Line {
    constructor(vertices = [], vertexCount = 0, color = [0.0, 1.0, 0.0], completed = false) {
        this.vertices = vertices;
        this.vertexCount = vertexCount;
        this.type = "line";
        this.color = color;
        this.completed = completed;
    }

    draw(x, y){
        if (this.vertexCount < 2) {
            this.vertices.push(x);
            this.vertices.push(y);

            this.vertexCount++;

            if (this.vertexCount == 2){
                this.completed = true;
            }

            renderAllObjects();
        } 
    }
}

