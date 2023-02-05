import { loadFile, render, saveFile, deleteVertex, renderAllObjects } from "./_main.js" 

// tambahin onclick di sini
document.getElementById("line-button").onclick = () => {render("LINE")}
document.getElementById("rectangle-button").onclick = () => {render("RECT")}
document.getElementById("square-button").onclick = () => {render("SQUARE")}
document.getElementById("polygon-button").onclick = () => {
  const verticesNum = document.getElementById("polygon-vertices").value;

  if (!!!verticesNum || verticesNum < 3) {
    alert("Please input the vertices number! (min. 3)");
    return;
  }
  render("POLY")
}

document.getElementById("save-button").onclick = () => {saveFile()}
document.getElementById("load-file").onchange = () => {loadFile()}

document.getElementById("delete-button").onclick = () => {deleteVertex()}

export const getColor = () => {
    let hex = document.getElementById("color-picker").value
    
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}
