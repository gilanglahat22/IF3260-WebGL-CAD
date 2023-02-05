import { Model } from "./model.js";
import { renderObject, renderAllObjects } from "./_main.js";

export class Square extends Model {
  constructor(){
    super([],0,'SQUARE',[0.0, 1.0, 0.0, 1.0],false,1)
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
            console.log("masuk");
            let v1 = {
              position: [this.vertices[0]['position'][0]+0.5, this.vertices[0]['position'][1]],
              color: this.color
            }

            let v2 = {
              position: [this.vertices[0]['position'][0], this.vertices[0]['position'][1]+0.5],
              color: this.color
            }

            let v3 = {
                position: [this.vertices[0]['position'][0]+0.5, this.vertices[0]['position'][1]+0.5],
                color: this.color
            }
            this.vertices.push(v1);
            this.vertices.push(v3);
            this.vertices.push(v2);
            this.vertexCount += 3;
        } 
        renderAllObjects();
    }
  }
}