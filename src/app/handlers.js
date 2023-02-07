import { loadFile, render, saveFile, clearCanvas} from "./_main.js" 

// tambahin onclick di sini
document.getElementById("clear-canvas").onclick = () => {clearCanvas();}
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

export const disableAllButtons = () => {
  document.getElementById("line-button").disabled = true
  document.getElementById("rectangle-button").disabled = true
  document.getElementById("square-button").disabled = true
  document.getElementById("polygon-button").disabled = true
}

export const enableAllButtons = () => {
  document.getElementById("line-button").disabled = false
  document.getElementById("rectangle-button").disabled = false
  document.getElementById("square-button").disabled = false
  document.getElementById("polygon-button").disabled = false
}
document.getElementById("save-button").onclick = () => {saveFile()}
document.getElementById("load-file").onchange = () => {loadFile()}

export const getColor = () => {
    let hex = document.getElementById("color-picker").value
    
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}
