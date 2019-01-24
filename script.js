const lengthOfGame = 5; //length of game in seconds
let game = {};

document.getElementById("start-button").addEventListener("click", function(){startGame()});

function startGame(event){
  context.clearRect(0,0, canvas.width, canvas.height);
  document.getElementById("start-button").remove();
  paintTeams();
  game = {};
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
  game.team1Name = team1Name.value;
  game.team2Name = team2Name.value;
  if (game.team1Name === game.team2Name || game.team1Name === "" || game.team2Name === ""){
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
  let button = `<button id="pick-your-words-button">Pick Your Words!</button>`;
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
    game.bet = betName.value
    document.getElementById("pick-your-words-button").remove();
    saveBetToDb(betName.value);
    paintPickYourWords(1);
  }

};

function paintPickYourWords(teamNumber){
  if (teamNumber === 1) {
    activeTeamName = game.team1Name;
    otherTeamName = game.team2Name;
  } else {
    activeTeamName = game.team2Name;
    otherTeamName = game.team1Name;
  };

  let wordsRowDiv = document.getElementById('words-row-div');
  let wordsRow = `<div class="col-md">
            <h3>${otherTeamName}, choose a challenge word: </h3>
          </div>
          <div class="col-md">
          <input type="password" name="word" list="selectWord" id="game-word">
          <input type="checkbox" onclick="toggleHidePassword('game-word')">
          <datalist id="selectWord">
          </datalist>
          </div>`;
          // <div class="col-md">
          //   <input type="password" name="word2" list="selectWord2" id="game-2-word">
          //   <input type="checkbox" onclick="toggleHidePassword('game-2-word')">
          //   <datalist id="selectWord2">
          //   </datalist>
          // </div>`;
  wordsRowDiv.innerHTML = wordsRow;
  let buttonDiv = document.getElementById('begin-game-button-div');
  let button = `<button id="begin-game-button">Ready to Draw, ${activeTeamName}!</button>`;
  buttonDiv.innerHTML = button;
  buttonDiv.addEventListener("click", beginDrawingRound);
  populateWord();
}

function beginDrawingRound(){
  let gameWord = document.getElementById('game-word');

  if (gameWord.value === ""){
    alert("Please choose a word!");
  } else {
    if (game.word_one) {
      game.word_two = gameWord.value;
    }else {
      game.word_one = gameWord.value;
    };
    document.getElementById("words-row-div").innerHTML = "";
    document.getElementById("begin-game-button").remove();
    saveWordToDb(gameWord);
    preTimer(3);
    paintBeginGame();
  }
};

function paintBeginGame(){

  let gameAnswerDiv = document.getElementById('game-answer-div');
  let gameAnswer = `<input type="text" placeholder="Enter your answer here!" id="game-answer">`;
  gameAnswerDiv.innerHTML = gameAnswer;

  let buttonDiv = document.getElementById('next-round-button-div');
  let button = `<button id="submit-answer-button">Submit Answer</button>`;
  buttonDiv.innerHTML = button;
  document.getElementById("submit-answer-button").addEventListener("click", function(){checkCompleteGame()});
};


function preTimer(seconds){
  let timeLeft = seconds;
  console.log(timeLeft);
  let timerDiv = document.getElementById('ready-set');
  window.setTimeout(function(){
    if (timeLeft === 3) {
      timerDiv.innerHTML = "Ready";
      document.getElementById("game-answer").innerText = "";

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
      startTimer(lengthOfGame);
    };
  }, 1000)
}

function startTimer(seconds){
  let timeLeft = seconds;
  let timesUp = document.getElementById('times-up')
  let timerDiv = document.getElementById('timer');
  let canvasDiv = document.getElementById('ready-set');
  window.setTimeout(function(){
    if (timeLeft >= 0) {
      timerDiv.innerHTML = timeLeft + ' seconds remaining';
      startTimer(timeLeft - 1);
    } else {
      timesUp.innerHTML = "Time's up! Enter your answer to see who suffers the consequences!";
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
  if (!game.match_1_winner){ //first round

  } else if (!game.match_2_winner) { //second round

  } else { //complete game

  }

  if (document.getElementById("game-answer").value != ""){
    let buttonDiv = document.getElementById('next-round-button-div');
    let button = `<button id="start-next-round-button">Start Next Round</button>`;
    buttonDiv.innerHTML = button;
    document.getElementById('start-next-round-button').addEventListener("click", startRound2);
    let answer = document.getElementById('game-answer');
    let canvasDiv = document.getElementById('ready-set');
    if(game.word_one === answer){
      game.match_1_winner = game.team1Name;
      canvasDiv.innerHTML = `You got it right!! ${game.team1Name} wins. ${game.team2Name} has to ${game.bet}.`;
    } else {
      game.match_1_winner = game.team2Name;
      canvasDiv.innerHTML = `Wrong! The answer was ${game.word_one}. ${game.team2Name} wins. ${game.team1Name} has to ${game.bet}.`;
    };
  };
}

function startRound2(){
  paintPickYourWords(2);
  context.clearRect(0,0, canvas.width, canvas.height);
};
