import { loadFile, render, saveFile } from "./_main.js" 

// tambahin onclick di sini
document.getElementById("line-button").onclick = () => {render("LINE")}
document.getElementById("square-button").onclick = () => {render("SQUARE")}

document.getElementById("save-button").onclick = () => {saveFile()}
document.getElementById("load-file").onchange = () => {loadFile()}

export const getColor = () => {
    let hex = document.getElementById("color-picker").value
    
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}
