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

  resize(idx,x,y){
    let a = (idx+1) % 4;
    let b = (idx+2) % 4;
    let c = (idx+3) % 4;

    let theta = this.angle * Math.PI / 180

    const sin = Math.sin(theta);
    const cos = Math.cos(theta);
    
    let deltaX = x - this.vertices[b].position[0];
    let deltaY = y - this.vertices[b].position[1];

    let length = deltaY * sin - deltaX * cos;
    let width  = deltaY * cos + deltaX * sin;

    let lengthProyeksiX = length * Math.cos(theta);
    let lengthProyeksiY = length * Math.sin(theta);
    let widthProyeksiX = width * Math.cos(theta);
    let widthProyeksiY = width * Math.sin(theta);

    this.vertices[idx].position[0] = this.vertices[b].position[0] - lengthProyeksiX + widthProyeksiY;
    this.vertices[idx].position[1] = this.vertices[b].position[1] + lengthProyeksiY + widthProyeksiX;

    this.vertices[a].position[0] = this.vertices[b].position[0] + widthProyeksiY;
    this.vertices[a].position[1] = this.vertices[b].position[1] + widthProyeksiX;

    this.vertices[c].position[0] = this.vertices[b].position[0] - lengthProyeksiX;
    this.vertices[c].position[1] = this.vertices[b].position[1] + lengthProyeksiY;
  }
}