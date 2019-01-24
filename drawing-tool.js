// set canvas id to variable
let currentDrawing = [];

//function startDrawing(){
let canvas = document.getElementById("drawing-canvas");

// get canvas 2D context and set it to the correct size
let context = canvas.getContext("2d");
resize();

// resize canvas when window is resized
function resize() {
 let drawingDiv = canvas.getBoundingClientRect();
 context.canvas.width = drawingDiv.width;
 context.canvas.height = drawingDiv.height;
}

window.addEventListener("resize", resize);

// last known position
let pos = { x: 0, y: 0 };

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

 context.beginPath(); // begin the drawing path

 context.lineWidth = 5; // width of line
 context.lineCap = "round"; // rounded end cap
 context.strokeStyle = color; // hex color of line

 context.moveTo(pos.x, pos.y); // from position
 setPosition(e);
 context.lineTo(pos.x, pos.y); // to position

 context.stroke(); // draw it!
}


function saveDrawing(){
   //currently creates png and opens a new window
     let canvas = document.getElementById("drawing-canvas");
     //let data = canvas.toDataURL("image/png");
     let data = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
     canvas.setAttribute("href", data);
     //Save file locally
     localStorage
     // let newWindow = window.open('about:blank','image from canvas');
     // newWindow.document.write("<img src='"+data+"' alt='from canvas'/>");
};

function redrawLastDrawing(e){
 context.clearRect(0,0, canvas.width, canvas.height);
 currentDrawing.forEach(function(){

 });
 currentDrawing = [];
};
