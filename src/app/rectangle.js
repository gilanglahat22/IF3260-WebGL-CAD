class Rectangle extends Model {
  constructor(
    vertices = [],
    vertexCount = 0,
    type = "RECTANGLE",
    color = [0.0, 1.0, 0.0, 1.0],
    completed = false,
    count = 4,
    angle = 0
  ) {
    super(vertices, vertexCount, type, color, completed, count)
    this.angle = angle
  }
  draw(x, y) {
    if (this.vertexCount < this.count) {
      let vertex = {
        id: this.vertexCount == 0 ? 0 : 2,
        position: [x, y],
        color: this.color,
      };

      this.vertices.push(vertex);

      this.vertexCount++;

      if (this.vertexCount == this.count) {
        this.completed = true;
        enableAllButtons();

        let v1 = {
          id: 1,
          position: [
            this.vertices[0]["position"][0],
            this.vertices[1]["position"][1],
          ],
          color: this.color,
        };

        let v2 = {
          id: 3,
          position: [
            this.vertices[1]["position"][0],
            this.vertices[0]["position"][1],
          ],
          color: this.color,
        };

        this.vertices.splice(1, 0, v1);
        this.vertices.push(v2);
        this.vertexCount += 2;
      }
      renderAllObjects();
    }
  }

  resize(idx, x, y) {
    let a = (idx + 1) % 4;
    let b = (idx + 2) % 4;
    let c = (idx + 3) % 4;

    let temp = 0;
    if (idx % 2 == 0){
      temp = c;
      c = a;
      a = temp;
    }

    let theta = (this.angle * Math.PI) / 180;

    const sin = Math.sin(theta);
    const cos = Math.cos(theta);

    let deltaX = x - this.vertices[b].position[0];
    let deltaY = y - this.vertices[b].position[1];

    let length = deltaY * sin - deltaX * cos;
    let width = deltaY * cos + deltaX * sin;

    let lengthProyeksiX = length * Math.cos(theta);
    let lengthProyeksiY = length * Math.sin(theta);
    let widthProyeksiX = width * Math.cos(theta);
    let widthProyeksiY = width * Math.sin(theta);

    this.vertices[idx].position[0] =
      this.vertices[b].position[0] - lengthProyeksiX + widthProyeksiY;
    this.vertices[idx].position[1] =
      this.vertices[b].position[1] + lengthProyeksiY + widthProyeksiX;

    this.vertices[a].position[0] =
      this.vertices[b].position[0] + widthProyeksiY;
    this.vertices[a].position[1] =
      this.vertices[b].position[1] + widthProyeksiX;

    this.vertices[c].position[0] =
      this.vertices[b].position[0] - lengthProyeksiX;
    this.vertices[c].position[1] =
      this.vertices[b].position[1] + lengthProyeksiY;
  }

  resizeByMetrix(sizeX,sizeY){
    let a = this.angle
    let x_awal = this.vertices[0].position[0]
    let y_awal = this.vertices[0].position[1]
    this.rotate(0)
    let v1_x = (this.vertices[1].position[0]-this.vertices[0].position[0])
    let v1_y = (this.vertices[1].position[1]-this.vertices[0].position[1])

    let v2_x = (this.vertices[2].position[0]-this.vertices[1].position[0])
    let v2_y = (this.vertices[2].position[1]-this.vertices[1].position[1])
    this.vertices[1].position[0] = this.vertices[0].position[0] + (1+sizeX/100)*v1_x
    this.vertices[1].position[1] = this.vertices[0].position[1] + (1+sizeX/100)*v1_y

    this.vertices[2].position[0] = this.vertices[1].position[0] + (1+sizeY/100)*v2_x
    this.vertices[2].position[1] = this.vertices[1].position[1] + (1+sizeY/100)*v2_y

    this.vertices[3].position[0] = this.vertices[2].position[0] - (1+sizeX/100)*v1_x
    this.vertices[3].position[1] = this.vertices[2].position[1] - (1+sizeX/100)*v1_y
    this.rotate(a)

    let geserx = this.vertices[0].position[0] - x_awal
    let gesery = this.vertices[0].position[1] - y_awal

    this.vertices[0].position[0] -= geserx
    this.vertices[0].position[1] -= gesery

    this.vertices[1].position[0] -= geserx
    this.vertices[1].position[1] -= gesery

    this.vertices[2].position[0] -= geserx
    this.vertices[2].position[1] -= gesery

    this.vertices[3].position[0] -= geserx
    this.vertices[3].position[1] -= gesery
    
  }


}
