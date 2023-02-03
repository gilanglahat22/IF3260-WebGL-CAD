import { loadObject, renderObject } from "./_main.js";


export class Line {
    constructor(vertices = [], points = 0, colors = [0.0, 0.0, 0.0], completed = false) {
        this.vertices = vertices;
        this.points = points;
        this.type = "line";
        this.colors = colors;
        this.completed = completed;
    }

    draw(x, y){
        if (this.points < 2) {
            this.vertices.push(x);
            this.vertices.push(y);
            console.log("load object");
            this.points++;
        } 

        if (this.points == 2){
            renderObject(this);
            this.completed = true;
        } else {
            loadObject(this);
        }
    }
}

