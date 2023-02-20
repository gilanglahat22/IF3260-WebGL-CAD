class Model {
    constructor(vertices = [], vertexCount = 0, type = "LINE", color = [0.0, 1.0, 0.0, 1.0], completed = false, count = 2) {
        this.vertices = vertices;
        this.vertexCount = vertexCount;
        this.count = count;
        this.type = type;
        this.color = color;
        this.completed = completed;
        this.angle = 0;
    }

    draw(x, y){
        if (this.vertexCount < this.count) {
            let vertex = {
                position: [x, y],
                color: this.color
            }
            
            this.vertices.push(vertex);
            this.vertices = ConvexHull(this.vertices)
            console.log(this.vertices)
            this.vertexCount = this.vertices.length

            if (this.vertexCount == this.count){
                enableAllButtons();
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

    isClicked(x, y){
        if (this.completed){
            let minX = this.vertices[0].position[0]
            let minY = this.vertices[0].position[1]
            let maxX = this.vertices[0].position[0]
            let maxY = this.vertices[0].position[1]
    
            for (let i = 1; i < this.vertexCount; i++){
                minX = Math.min(minX, this.vertices[i].position[0])
                maxX = Math.max(maxX, this.vertices[i].position[0])
                minY = Math.min(minY, this.vertices[i].position[1])
                maxY = Math.max(maxY, this.vertices[i].position[1])
            }
    
            return (minX <= x && x <= maxX && minY <= y && y <= maxY)
        }
    }

    rotate(angle){
        let DeltaAngle = angle - this.angle;
        let xSum = 0;
        let ySum = 0;

        for (let i = 0; i < this.vertexCount; i++){
            xSum += this.vertices[i].position[0];
            ySum += this.vertices[i].position[1];
        }
        var xCenter = xSum / this.vertexCount;
        var yCenter = ySum / this.vertexCount;
        const rad = (Math.PI / 180) * DeltaAngle;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        this.angle = angle;

        for(let i = 0; i < this.vertexCount; i++){
          var dx = this.vertices[i].position[0] - xCenter;
          var dy = this.vertices[i].position[1] - yCenter;
          this.vertices[i].position[0] = (dx*cos) + (dy*sin) + xCenter;
          this.vertices[i].position[1] = (dy*cos) - (dx*sin) + yCenter;
        }
      }

    resize(idx,x,y){
        this.vertices[idx].position[0] = x;
        this.vertices[idx].position[1] = y;
    }
}

