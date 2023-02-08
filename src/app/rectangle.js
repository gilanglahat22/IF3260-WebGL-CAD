import { enableAllButtons } from "./handlers.js";
import { Model } from "./model.js";
import { renderObject, renderAllObjects } from "./_main.js";

export class Rectangle extends Model {
  constructor(){
    super([],0,'RECT',[0.0, 1.0, 0.0, 1.0],false,2)
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
            enableAllButtons();
            console.log("masuk");
            let v1 = {
              position: [this.vertices[0]['position'][0], this.vertices[1]['position'][1]],
              color: this.color
            }

            let v2 = {
              position: [this.vertices[1]['position'][0], this.vertices[0]['position'][1]],
              color: this.color
            }
            this.vertices.splice(1,0,v1);
            this.vertices.push(v2);
            this.vertexCount += 2;
        } 
        renderAllObjects();
    }
  }
  rotate(angle){
    var xCenter = (this.vertices[0].position[0]+this.vertices[1].position[0]+this.vertices[2].position[0]+this.vertices[3].position[0])/4;
    var yCenter = (this.vertices[0].position[1]+this.vertices[1].position[1]+this.vertices[2].position[1]+this.vertices[3].position[1])/4;
    const rad = (Math.PI / 180) * angle;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    for(let i = 0; i<4; i++){
      var dx = this.vertices[i].position[0] - xCenter;
      var dy = this.vertices[i].position[1] - xCenter;
      this.vertices[i].position[0] = dx*cos - dy*sin + xCenter;
      this.vertices[i].position[1] = dx*sin + dy*cos + yCenter;
    }
  }
}