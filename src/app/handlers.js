
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

const disableAllButtons = () => {
  document.getElementById("line-button").disabled = true
  document.getElementById("rectangle-button").disabled = true
  document.getElementById("square-button").disabled = true
  document.getElementById("polygon-button").disabled = true
  document.getElementById("polygon-vertices").disabled = true
}

const enableAllButtons = () => {
  document.getElementById("line-button").disabled = false
  document.getElementById("rectangle-button").disabled = false
  document.getElementById("square-button").disabled = false
  document.getElementById("polygon-button").disabled = false
  document.getElementById("polygon-vertices").disabled = false
}

document.getElementById("submitResize-button").onclick = () => {resizeObject()}
document.getElementById("save-button").onclick = () => {saveFile()}
document.getElementById("load-file").onchange = () => {loadFile()}

const getColor = () => {
  const hex = document.getElementById("color-picker").value
    
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
