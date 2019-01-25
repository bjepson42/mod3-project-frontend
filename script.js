const lengthOfGame = 2; //length of game in seconds
let game = {};
let usersObj = {};

document.getElementById("start-button").addEventListener("click", preStart);
document.getElementById("save-button").addEventListener("click", saveDrawing);

function preStart(){
  document.getElementById("start-button").remove();
  startGame();
};

function startGame(){
  context.clearRect(0,0, canvas.width, canvas.height);
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
  let button = `<button id="pick-your-punishment-button">Pick Your Dare!</button>`;
  buttonDiv.innerHTML = button;
  buttonDiv.addEventListener("click", submitPickYourPunishment);
  populateTeamDropdowns();
};

function populateSideBars(){
  let leftBar = document.getElementById('leftOfCanvasDiv');
  let rightBar = document.getElementById('rightOfCanvasDiv');
  usersObj.forEach(function(user){


  })


};


function submitPickYourPunishment(){
  let team_one_name = document.getElementById('user-1-input');
  let team_two_name = document.getElementById('user-2-input');
  game.team_one_name = toCamelCase(team_one_name.value);
  game.team_two_name = toCamelCase(team_two_name.value);
  if (game.team_one_name === game.team_two_name || game.team_one_name === "" || game.team_two_name === ""){
    alert("Select different team names!");
  } else {
    team_one_name.disabled = true;
    team_two_name.disabled = true;
    document.getElementById("pick-your-punishment-button").remove();
    saveUsersToDb(game.team_one_name, game.team_two_name);
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
  </div> <br>`;
  punishmentDiv.innerHTML = punishment;
  let buttonDiv = document.getElementById('pick-your-words-button-div');
  let button = `<button id="pick-your-words-button">Pick Your Word, ${game.team_two_name}!</button>`;
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
    let dataToSave = toCamelCase(betName.value);
    saveBetToDb(dataToSave);
    paintPickYourWords(1);
  }

};

function paintPickYourWords(teamNumber){
  if (teamNumber === 1) {
    activeTeamName = game.team_one_name;
    otherTeamName = game.team_two_name;
  } else {
    activeTeamName = game.team_two_name;
    otherTeamName = game.team_one_name;
  };
  document.getElementById('ready-set').innerText = "";
  let wordsRowDiv = document.getElementById('words-row-div');
  let wordsRow = `<div class="col-md">
            <h3>${otherTeamName}, choose a challenge word: </h3>
          </div>
          <div class="col-md">
          <input type="password" name="word" list="selectWord" id="game-word">
          <input type="checkbox" onclick="toggleHidePassword('game-word')">
          <datalist id="selectWord">
          </datalist>
          <button id="random-word-button">Random Word</button>
          </div>`;
  wordsRowDiv.innerHTML = wordsRow;
  let buttonDiv = document.getElementById('begin-game-button-div');
  let button = `<button id="begin-game-button">Round ${teamNumber}. Get Ready to Draw, ${activeTeamName}!</button>`;
  let randomWordButton = document.getElementById('random-word-button')
  buttonDiv.innerHTML = button;
  buttonDiv.addEventListener("click", beginDrawingRound);
  randomWordButton.addEventListener("click", function(){
    populateWord();
    randomWordButton.remove();
    if (document.getElementById("game-word").value != "") {document.getElementById("game-word").disabled = true;};
  });
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
    let dataToSave = toCamelCase(gameWord.value);
    saveWordToDb(dataToSave);
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
      timesUp.innerHTML = "Time's up!";
      document.getElementById('timer').innerHTML = "";
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
  //let answer = document.getElementById('game-answer');
  if (document.getElementById('game-answer').value != ""){
    document.getElementById('times-up').innerText = "";

    if (!game.match_one_winner){ //first round end
      let buttonDiv = document.getElementById('next-round-button-div');
      let button = `<button id="start-next-round-button">Start Next Round</button>`;
      buttonDiv.innerHTML = button;
      document.getElementById('start-next-round-button').addEventListener("click", startRound2);
      document.getElementById("game-answer").hidden = true;
      matchWinnerHandler("one");
    } else { //second round end
      let buttonDiv = document.getElementById('next-round-button-div');
      let button = `<button id="start-another-game-button">Start Another Game</button>`;
      buttonDiv.innerHTML = button;
      document.getElementById('start-another-game-button').addEventListener("click", anotherGame);
      document.getElementById("game-answer").hidden = true;
      matchWinnerHandler("two");
    };
  };
};

function matchWinnerHandler(round){
  let canvasDiv = document.getElementById('ready-set');
  let gameAnswer = toCamelCase(document.getElementById('game-answer').value);
  let gameAnswerDiv = document.getElementById('game-answer-div')
  let gameWord = game.word_one;
  if(game.word_two){ gameWord = game.word_two };

  if (round === "one"){
    if(toCamelCase(gameWord) === toCamelCase(gameAnswer)){
      game.match_one_winner = game.team_one_name;
      gameAnswerDiv.innerHTML = `Correct! ${game.team_one_name} wins this round!`;
    } else {
      game.match_one_winner = game.team_two_name;
      gameAnswerDiv.innerHTML = `Wrong! The answer was ${game.word_one}. ${game.team_two_name} wins this round!`;
    };
  } else if (round === "two"){
    if(toCamelCase(gameWord) === toCamelCase(gameAnswer)){
      game.match_two_winner = game.team_two_name;
      gameAnswerDiv.innerHTML = `Correct! ${game.team_two_name} wins this round!`;
    } else {
      game.match_two_winner = game.team_one_name;
      gameAnswerDiv.innerHTML = `Wrong! The answer was ${game.word_two}. ${game.team_one_name} wins this round!`;
    };
    completeGame();
  }
}


function startRound2(){
  //document.getElementById("game-answer").remove();
  document.getElementById("start-next-round-button").remove();
  document.getElementById('game-answer-div').innerHTML =""
  paintPickYourWords(2);
  context.clearRect(0,0, canvas.width, canvas.height);
};

function completeGame(){
  ///put save game info here
  if (game.match_one_winner === game.match_two_winner){
  game.winner = game.match_one_winner;
  if (game.winner === game.team_one_name){
    game.loser = game.team_two_name;
  } else {
    game.loser = game.team_one_name;
  };
  delete game.match_one_winner;
  delete game.match_two_winner;
  delete game.team_one_name;
  delete game.team_two_name;
  saveGameToDb(game);
  };
};

function anotherGame(){
  startGame();
  document.getElementById("start-another-game-button").remove();
  document.getElementById("game-answer").remove();
  document.getElementById("punishment").remove();
  document.getElementById("ready-set").innerHTML = "";
  document.getElementById("game-answer-div").innerHTML="";

};

function toCamelCase(str) {
  var lower = String(str).toLowerCase();
  return lower.replace(/(^| )(\w)/g, function(x) {
    return x.toUpperCase();
  });
}

game2 = {word_one_id: 1,
          word_two_id: 2,
          winner_id: 1,
          loser_id: 2,
          bet_id: 1,
          drawing_one_id: 1,
          drawing_two_id: 2
        }

game4 = {word_one_id: 1,
          word_two_id: 2,
          winner_id: 1,
          loser_id: 2,
          bet_id: 1
        }

//don't allow click submit too early
//save pictures
//game cards
//delete words??
