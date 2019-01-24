const lengthOfGame = 5; //length of game in seconds

//populateDropdowns();
document.getElementById("start-next-round-button").hidden = true;
document.getElementById("submit-answer-button").hidden = true;
document.getElementById("game-answer-div").hidden = true;
document.getElementById("game-title-div").hidden = true;
document.getElementById("start-button").addEventListener("click", function(){startGame()});
document.getElementById("submit-answer-button").addEventListener("click", function(){checkCompleteGame()});


function startGame(event){
  context.clearRect(0,0, canvas.width, canvas.height);
  document.getElementById("start-button").remove();
  paintTeams();
}

function paintTeams(){
  let teamRowDiv = document.getElementById('team-row-div');

  let teamRow = `<div class="col-md">
    <h3>Team 1</h3>
      <input type="text" name="user1" list="selectUser1" id="user-1-input"/>
      <datalist id="selectUser1">
      </datalist>
    </div>
    <div class="col-sm">
      <h2>VS.</h2>
    </div>
    <div class="col-md">
    <h3>Team 2</h3>
      <input type="text" name="user2" list="selectUser2" id="user-2-input"/>
      <datalist id="selectUser2">
      </datalist>
    </div>`;
  teamRowDiv.innerHTML = teamRow;

  let buttonDiv = document.getElementById('pick-your-punishment-button-div');
  let button = `<button id="pick-your-punishment-button">Pick Your Punishment!</button>`;
  buttonDiv.innerHTML = button;
  buttonDiv.addEventListener("click", submitPickYourPunishment);
  populateTeamDropdowns();
};


function submitPickYourPunishment(){
  let team1Name = document.getElementById('user-1-input');
  let team2Name = document.getElementById('user-2-input');
  if (team1Name.value === team2Name.value || team1Name.value === "" || team2Name.value === ""){
    alert("Select different team names!");
  } else {
    team1Name.disabled = true;
    team2Name.disabled = true;
    document.getElementById("pick-your-punishment-button").remove();
    saveUsersToDb(team1Name.value, team2Name.value);
    paintPickYourPunishment();
  }
};

function paintPickYourPunishment(){
  let punishmentDiv = document.getElementById('punishment-div');

  let punishment = `<div id="punishment">
    <h3>The Loser Will:</h3>
    <input type="text" name="product" list="betName" id="bet-name-list"/>
    <datalist id="betName">
    </datalist>
  </div>`;
  punishmentDiv.innerHTML = punishment;
  let buttonDiv = document.getElementById('pick-your-words-button-div');
  let button = `<br><button id="pick-your-words-button">Pick Your Words!</button>`;
  buttonDiv.innerHTML = button;
  buttonDiv.addEventListener("click", submitPickYourWords);
  populateCompetingForDropdown();
};


function submitPickYourWords(){
  let betName = document.getElementById('bet-name-list');
  if (betName.value === ""){
    alert("Select a Punishment!");
  } else {
    betName.disabled = true;
    document.getElementById("pick-your-words-button").remove();
    saveBetToDb(betName.value);
    paintPickYourWords();
  }

};

function paintPickYourWords(){
  let wordsRowDiv = document.getElementById('words-row-div');

  let wordsRow = `<div class="col-md">
            <input type="password" name="word1" list="selectWord1" id="game-1-word">
            <input type="checkbox" onclick="toggleHidePassword('game-1-word')">
            <datalist id="selectWord1">
            </datalist>
          </div>
          <div class="col-sm">
            <h2>Enter Your Words</h2>
          </div>
          <div class="col-md">
            <input type="password" name="word2" list="selectWord2" id="game-2-word">
            <input type="checkbox" onclick="toggleHidePassword('game-2-word')">
            <datalist id="selectWord2">
            </datalist>
          </div>`;
  wordsRowDiv.innerHTML = wordsRow;
  let buttonDiv = document.getElementById('begin-game-button-div');
  let button = `<br><button id="begin-game-button">Ready Team 1!</button>`;
  buttonDiv.innerHTML = button;
  buttonDiv.addEventListener("click", beginGame);
  populateWord();
}

function beginGame(){
  let game1Word = document.getElementById('game-1-word');
  let game2Word = document.getElementById('game-2-word');
  if (game1Word.value === game2Word.value || game1Word.value === "" || game2Word.value === ""){
    alert("Select different team names!");
  } else {
    game1Word.disabled = true;
    game2Word.disabled = true;
    document.getElementById("begin-game-button").remove();
    saveWordsToDb(game1Word.value, game2Word.value);
    preTimer(3);
    paintBeginGame();
  }
};

function paintBeginGame(){


};


function preTimer(seconds){
  let timeLeft = seconds;
  console.log(timeLeft);
  let timerDiv = document.getElementById('ready-set');
  window.setTimeout(function(){
    if (timeLeft === 3) {
      timerDiv.innerHTML = "Ready";
      document.getElementById("game-answer").innerText = "";
      document.getElementById("start-next-round-button").hidden = true;
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

function toggleHidePassword(elementId) {
  var x = document.getElementById(elementId);
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}


function checkCompleteGame(){
  if (document.getElementById("game-answer").value != ""){
    document.getElementById("start-next-round-button").hidden = false;
    document.getElementById("submit-answer-button").hidden = true;
    document.getElementById("game-answer-div").hidden = true;
    document.getElementById("game-title-div").hidden = false;
    let title = document.getElementById('game-title');
    let answer = document.getElementById('game-answer');
    let canvasDiv = document.getElementById('ready-set');
    if(title === answer){
      canvasDiv.innerHTML = `You got it right!! Player ${"foo1"} wins. Player ${"foo2"} has to ${"punishment 1"}.`;
    } else {
      canvasDiv.innerHTML = `Wrong! The answer was ${title.value}. Player ${"foo2"} wins. Player ${"foo1"} has to ${"punishment 1"}.`;
    };
  };
}
