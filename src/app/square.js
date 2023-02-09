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
  resize(idx,x,y){
    // let adjY = 3-idx;
    // let adjX;
    // if(idx==2 || idx==3){
    //   adjX = 5-idx;
    // }else{
    //   adjX = 1-idx;
    // } 
    // let idxNotGeser = (idx+2)%4;
    // let geser;
    // if(this.vertices[idx].position[0]>=this.vertices[idxNotGeser].position[0]){
    //   geser = y-this.vertices[idx].position[1];
    // }else{
    //   geser = x-this.vertices[idx].position[0];
    // }

    // if(this.vertices[idx].position[0]<this.vertices[idxNotGeser].position[0]
    //   && this.vertices[idx].position[1]>this.vertices[idxNotGeser].position[1]){
    //     this.vertices[idx].position[0] += geser;
    //     this.vertices[idx].position[1] -= geser;
    //     this.vertices[adjY].position[0] += geser;
    //     this.vertices[adjX].position[1] -= geser;
    // }else if(this.vertices[idx].position[0]>this.vertices[idxNotGeser].position[0]
    //   && this.vertices[idx].position[1]<this.vertices[idxNotGeser].position[1]){
    //     this.vertices[idx].position[0] -= geser;
    //     this.vertices[idx].position[1] += geser;
    //     this.vertices[adjY].position[0] -= geser;
    //     this.vertices[adjX].position[1] += geser;
    //   }else{
    //     this.vertices[idx].position[0] += geser;
    //     this.vertices[idx].position[1] += geser;
    //     this.vertices[adjX].position[1] += geser;
    //     this.vertices[adjY].position[0] += geser;
    //   }
    let a = (idx+1) % 4;
    let b = (idx+2) % 4;
    let c = (idx+3) % 4;

    let theta = this.angle * Math.PI / 180

    let deltaX = this.vertices[b].position[0] - x;
    let deltaY = y - this.vertices[b].position[1];

    let length = deltaX * Math.cos(theta) + deltaY * Math.sin(theta);
    let width = deltaY * Math.cos(theta) - deltaX * Math.sin(theta);

    if (Math.abs(length)>Math.abs(width)){
      if(width>0){
        width = Math.abs(length)
      }else{
        width = -Math.abs(length)
      }
    }else{
      if(length>0){
        length = Math.abs(width)
      }else{
        length = -Math.abs(width)
      }
    }

    this.vertices[idx].position[0] = this.vertices[b].position[0] - length * Math.cos(theta) + width * Math.sin(theta);
    this.vertices[idx].position[1] = this.vertices[b].position[1] + length * Math.sin(theta) + width * Math.cos(theta);

    this.vertices[a].position[0] = this.vertices[b].position[0] + width * Math.sin(theta);
    this.vertices[a].position[1] = this.vertices[b].position[1] + width * Math.cos(theta);

    this.vertices[c].position[0] = this.vertices[b].position[0] - length*Math.cos(theta);
    this.vertices[c].position[1] = this.vertices[b].position[1] + length*Math.sin(theta);
  }
}