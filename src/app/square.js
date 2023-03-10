class Square extends Model {
  constructor(
    vertices = [],
    vertexCount = 0,
    type = "SQUARE",
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
        id: 0,
        position: [x, y],
        color: this.color,
      };

      this.vertices.push(vertex);

      this.vertexCount++;

      if (this.vertexCount == this.count) {
        this.completed = true;
        enableAllButtons();
        let absisGeser = this.vertices[0]["position"][0] + 0.5;
        let ordinatGeser = this.vertices[0]["position"][1] - 0.5;
        if (absisGeser >= 0.97) {
          absisGeser -= 1;
        }
        if (ordinatGeser >= 0.97) {
          ordinatGeser -= 1;
        }
        let v1 = {
          id: 1,
          position: [absisGeser, this.vertices[0]["position"][1]],
          color: this.color,
        };

        let v2 = {
          id: 2,
          position: [absisGeser, ordinatGeser],
          color: this.color,
        };

        let v3 = {
          id: 3,
          position: [this.vertices[0]["position"][0], ordinatGeser],
          color: this.color,
        };

        this.vertices.push(v1);
        this.vertices.push(v2);
        this.vertices.push(v3);
        // this.vertices.push(v3);
        // this.vertices.push(v2);
        // this.vertices.push(v1);

        this.vertexCount += 3;
      }
      renderAllObjects();
    }
  }
  resize(idx, x, y) {
    let a = (idx + 1) % 4;
    let b = (idx + 2) % 4;
    let c = (idx + 3) % 4;
    
    let temp = 0;
    if (idx % 2 != 0){
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

    // Buat width dan length jadi max(length,width)
    if (Math.abs(length) > Math.abs(width)) {
      if (width > 0) {
        width = Math.abs(length);
      } else {
        width = -Math.abs(length);
      }
    } else {
      if (length > 0) {
        length = Math.abs(width);
      } else {
        length = -Math.abs(width);
      }
    }

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


  // Hitung koordinat titik pusat terlebih dahulu
  // Kemudian hidung sin,cos dari titik pusat ke titik sudut
  // Setelah itu hitung perubahan panjang diagonal
  // Maka, perubahan panjang dapat dihitung dengan perubahan diagonal*cos(tetha)
  // Perubahan panjang y dapat dihitung dengan perubahan diagonal * sin(tetha)
  resizeByMetrix(sizeX,sizeY){
    let xSum = 0;
    let ySum = 0;
    var quadratX = (this.vertices[0].position[0]-this.vertices[1].position[0])*(this.vertices[0].position[0]-this.vertices[1].position[0]);
    var quadratY = (this.vertices[0].position[1]-this.vertices[1].position[1])*(this.vertices[0].position[1]-this.vertices[1].position[1]);
    var currLength = Math.sqrt(quadratX+quadratY);
    var deltaLength = currLength*sizeX/200;
    for (let i = 0; i < this.vertexCount; i++) {
      xSum += this.vertices[i].position[0];
      ySum += this.vertices[i].position[1];
    }
    var xCenter = xSum / this.vertexCount;
    var yCenter = ySum / this.vertexCount;

    for(let i = 0; i<this.vertexCount; i++){
      var proyeksiX = this.vertices[i].position[0] - xCenter;
      var proyeksiY = this.vertices[i].position[1] - yCenter;
      var hipotenusaProyeksi = Math.sqrt((proyeksiX*proyeksiX) + (proyeksiY*proyeksiY));
      var deltaHipotenusa = Math.sqrt(2*deltaLength*deltaLength);
      if(sizeX>=0){
        this.vertices[i].position[0] += deltaHipotenusa*proyeksiX/hipotenusaProyeksi;
        this.vertices[i].position[1] += deltaHipotenusa*proyeksiY/hipotenusaProyeksi;
      }else{
        this.vertices[i].position[0] -= deltaHipotenusa*proyeksiX/hipotenusaProyeksi;
        this.vertices[i].position[1] -= deltaHipotenusa*proyeksiY/hipotenusaProyeksi;
      }
    }
  }
}
