import { render } from "./_main.js" 

// tambahin onclick di sini
document.getElementById("line-button").onclick = () => {render("LINE")}
document.getElementById("square-button").onclick = () => {render("SQUARE")}