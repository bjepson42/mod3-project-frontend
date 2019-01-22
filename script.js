const lengthOfGame = 5; //length of game in seconds
document.getElementById("submit-answer-button").hidden = true;
document.getElementById("game-answer-div").hidden = true;
document.getElementById("start-button").addEventListener("click", function(){startGame()});
document.getElementById("submit-answer-button").addEventListener("click", function(){checkCompleteGame()});

function startGame(e){
  ctx.clearRect(0,0, canvas.width, canvas.height);
  preTimer(3);
}

function preTimer(seconds){
  let timeLeft = seconds;
  console.log(timeLeft);
  let timerDiv = document.getElementById('ready-set');
  window.setTimeout(function(){
    if (timeLeft === 3) {
      timerDiv.innerHTML = "Ready";
      document.getElementById("start-button").hidden = true;
      document.getElementById("submit-answer-button").hidden = false;
      document.getElementById("game-answer-div").hidden = false;
      document.getElementById("game-title-div").hidden = true;
      preTimer(timeLeft - 1);
    } else if (timeLeft === 2) {
      timerDiv.innerHTML = "Set";
      preTimer(timeLeft - 1);
    } else if (timeLeft === 1) {
      timerDiv.innerHTML = "Draw!";
      preTimer(timeLeft - 1);
    } else if (timeLeft === 0) {
      timerDiv.innerHTML = "";
      document.addEventListener("mousemove", draw);
      document.addEventListener("mousedown", setPosition);
      document.addEventListener("mouseenter", setPosition);
      startTimer(lengthOfGame); //length of
    };
  }, 1000)
}

function startTimer(seconds){
  let timeLeft = seconds;
  let timerDiv = document.getElementById('timer');
  let canvasDiv = document.getElementById('ready-set');
  window.setTimeout(function(){
    if (timeLeft >= 0) {
      timerDiv.innerHTML = timeLeft + ' seconds remaining';
      startTimer(timeLeft - 1);
    } else {
      canvasDiv.innerHTML = "Time's up! Enter your answer to see who suffers the consequences!";
      document.removeEventListener("mousemove", draw);
      document.removeEventListener("mousedown", setPosition);
      document.removeEventListener("mouseenter", setPosition);
    }
  }, 1000)
}

function toggleHideTitleDiv() {
  var x = document.getElementById("game-title");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}


function checkCompleteGame(){
  document.getElementById("start-button").hidden = false;
  document.getElementById("submit-answer-button").hidden = true;
  document.getElementById("game-answer-div").hidden = true;
  document.getElementById("game-title-div").hidden = false;

  let title = document.getElementById('game-title');
  let answer = document.getElementById('game-answer');
  let canvasDiv = document.getElementById('ready-set');
  if (title === answer){
    canvasDiv.innerHTML = `You got it right!! Player ${"foo1"} wins. Player ${"foo2"} has to ${"punishment 1"}.`;
  } else {
    canvasDiv.innerHTML = `Wrong! Player ${"foo2"} wins. Player ${"foo1"} has to ${"punishment 1"}.`;
  };
}
