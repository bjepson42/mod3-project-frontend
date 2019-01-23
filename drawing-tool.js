// set canvas id to variable
var currentDrawing = [];

//function startDrawing(){
var canvas = document.getElementById("drawing-canvas");

// get canvas 2D context and set it to the correct size
var ctx = canvas.getContext("2d");
resize();

// resize canvas when window is resized
function resize() {
  let drawingDiv = canvas.getBoundingClientRect();
  ctx.canvas.width = drawingDiv.width;
  ctx.canvas.height = drawingDiv.height;
}

window.addEventListener("resize", resize);

document.getElementById("save-button").addEventListener("click", saveDrawing);
document.getElementById("redraw-button").addEventListener("click", redrawLastDrawing);

// last known position
var pos = { x: 0, y: 0 };

// new position from mouse events
function setPosition(e) {
  let drawingDiv = canvas.getBoundingClientRect();
  pos.x = e.x - drawingDiv.left;
  pos.y = e.y - drawingDiv.top;
}

function draw(e) {
  if (e.buttons !== 1) return; // if mouse is pressed.....

  var color = '#f4f4f0'; //add color picker?
  //purple chalk-#c4adc9, turquoise chalk-#6fe7db, pink chalk #f2a3bd

  console.log(`${pos.x}, ${pos.y}, ${e.timeStamp}`);
  currentDrawing.push([[pos.x, pos.y], e.timeStamp]);

  ctx.beginPath(); // begin the drawing path

  ctx.lineWidth = 10; // width of line
  ctx.lineCap = "round"; // rounded end cap
  ctx.strokeStyle = color; // hex color of line

  ctx.moveTo(pos.x, pos.y); // from position
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); // to position

  ctx.stroke(); // draw it!
}


function saveDrawing(){
    //currently creates png and opens a new window
      let canvas = document.getElementById("drawing-canvas");
      //let data = canvas.toDataURL("image/png");
      let data = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      canvas.setAttribute("href", data);
      //Save file locally

      // let newWindow = window.open('about:blank','image from canvas');
      // newWindow.document.write("<img src='"+data+"' alt='from canvas'/>");
};

function redrawLastDrawing(e){
  ctx.clearRect(0,0, canvas.width, canvas.height);
  currentDrawing.forEach(function(){

  });
  currentDrawing = [];
};
