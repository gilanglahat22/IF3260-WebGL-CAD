function dotProduct(point1, point2){
  return point1[0]*point2[0] + point1[1]*point2[1];
}

function subTract(point1, point2){
  return [point1[0]-point2[0],point1[1]-point2[1]];
}

// Returns the point in 'Polygon' that maximizes the dot product with 'v'
function MaxDot(polygon, vertex) {
  let maxdot = Number.NEGATIVE_INFINITY;
  let ret;
  for (let i = 0; i<polygon.vertexCount; i++) {
    var dot = dotProduct(polygon.vertices[i].position,vertex);
    if (dot > maxdot){
      maxdot = dot;
      ret = polygon.vertices[i].position;
    }
  }
  return ret;
}

// Returns the MaxDot point of the Minkowski difference polygon1 - polygon2 w.r.t. v
function MinkowskiDiff(polygon1, polygon2, vertex) {
  let point1 = MaxDot(polygon1, vertex);
  let point2 = MaxDot(polygon2, [-vertex[0], -vertex[1]]);
  return subTract(point1,point2);
}

// Returns a cross b cross c (assuming 0 as the third coordinate) 
function tripleProduct([ax, ay], [bx, by], [cx, cy]) {
  let z = ax * by - ay * bx;
  return [-cy * z, cx * z];
}

// The Gilbert-Johnson-Keerthi algorithm
export const gjk = (polygon1, polygon2)=>{
  // First point of polygon1-polygon2
  let a = MinkowskiDiff(polygon1, polygon2, [1, 1]);

  // First direction
  let v = [-a[0], -a[1]];

  // Second point
  let b = MinkowskiDiff(polygon1, polygon2, v);
  if (dotProduct(b, v) <= 0) return false; // Second point fails

  // Second direction
  let ab = subTract(b, a);
  v = tripleProduct(ab, [-a[0], -a[1]], ab);

  for (;;) {
    // Third point
    let c = MinkowskiDiff(polygon1, polygon2, v);
    if (dotProduct(c, v) <= 0) return false; // Third point fails

    let c0 = [-c[0], -c[1]];
    let cb = subTract(b, c);
    let ca = subTract(a, c);

    let cbPerp = tripleProduct(ca, cb, cb);
    let caPerp = tripleProduct(cb, ca, ca);

    if (dotProduct(caPerp, c0) > 0) {
      b = c;
      v = caPerp;
    } else if (dotProduct(cbPerp, c0) > 0) {
      a = c;
      v = cbPerp;
    } else return true;
  }
}