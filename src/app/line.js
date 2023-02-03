import { renderObject, renderAllObjects } from "./_main.js";


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
}

