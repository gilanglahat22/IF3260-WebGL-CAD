import { enableAllButtons } from "./handlers.js";
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
            enableAllButtons();
            console.log("masuk");
            let absisGeser = this.vertices[0]['position'][0]+0.5;
            let ordinatGeser = this.vertices[0]['position'][1]+0.5;
            if(absisGeser>=0.97){
              absisGeser -= 1;
            }
            if(ordinatGeser>=0.97){
              ordinatGeser -= 1;
            }
            let v1 = {
              position: [absisGeser, this.vertices[0]['position'][1]],
              color: this.color
            }

            let v2 = {
              position: [this.vertices[0]['position'][0], ordinatGeser],
              color: this.color
            }

            let v3 = {
                position: [absisGeser, ordinatGeser],
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
  resize(idx,xCurr,yCurr){
    let adjY = 3-idx;
    let adjX;
    if(idx==2 || idx==3){
      adjX = 5-idx;
    }else{
      adjX = 1-idx;
    } 
    let idxNotGeser = (idx+2)%4;
    let geser;
    if(this.vertices[idx].position[0]>=this.vertices[idxNotGeser].position[0]){
      geser = yCurr-this.vertices[idx].position[1];
    }else{
      geser = xCurr-this.vertices[idx].position[0];
    }
    if(this.vertices[idx].position[0]<this.vertices[idxNotGeser].position[0]
      && this.vertices[idx].position[1]>this.vertices[idxNotGeser].position[1]){
        this.vertices[idx].position[0] += geser;
        this.vertices[idx].position[1] -= geser;
        this.vertices[adjY].position[0] += geser;
        this.vertices[adjX].position[1] -= geser;
    }else if(this.vertices[idx].position[0]>this.vertices[idxNotGeser].position[0]
      && this.vertices[idx].position[1]<this.vertices[idxNotGeser].position[1]){
        this.vertices[idx].position[0] -= geser;
        this.vertices[idx].position[1] += geser;
        this.vertices[adjY].position[0] -= geser;
        this.vertices[adjX].position[1] += geser;
      }else{
        this.vertices[idx].position[0] += geser;
        this.vertices[idx].position[1] += geser;
        this.vertices[adjX].position[1] += geser;
        this.vertices[adjY].position[0] += geser;
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