const lengthOfGame = 2; //length of game in seconds
let game = {};

document.getElementById("start-button").addEventListener("click", preStart);

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


function submitPickYourPunishment(){
  let team_one_name = document.getElementById('user-1-input');
  let team_two_name = document.getElementById('user-2-input');
  game.team_one_name = team_one_name.value;
  game.team_two_name = team_two_name.value;
  if (game.team_one_name === game.team_two_name || game.team_one_name === "" || game.team_two_name === ""){
    alert("Select different team names!");
  } else {
    team_one_name.disabled = true;
    team_two_name.disabled = true;
    document.getElementById("pick-your-punishment-button").remove();
    saveUsersToDb(team_one_name.value, team_two_name.value);
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
    saveBetToDb(betName.value);
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
          </div>`;
          // <div class="col-md">
          //   <input type="password" name="word2" list="selectWord2" id="game-2-word">
          //   <input type="checkbox" onclick="toggleHidePassword('game-2-word')">
          //   <datalist id="selectWord2">
          //   </datalist>
          // </div>`;
  wordsRowDiv.innerHTML = wordsRow;
  let buttonDiv = document.getElementById('begin-game-button-div');
  let button = `<button id="begin-game-button">Round ${teamNumber}. Get Ready to Draw, ${activeTeamName}!</button>`;
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
      matchWinnerHandler("one");
    } else { //second round end
      let buttonDiv = document.getElementById('next-round-button-div');
      let button = `<button id="start-another-game-button">Start Another Game</button>`;
      buttonDiv.innerHTML = button;
      document.getElementById('start-another-game-button').addEventListener("click", anotherGame);
      matchWinnerHandler("two");
    };
  };
};

function matchWinnerHandler(round){
  let canvasDiv = document.getElementById('ready-set');
  let gameWord = game.word_one;
  if(game.word_two){ gameWord = game.word_two };

  if(gameWord === document.getElementById('game-answer').value){
    game.match_one_winner = game.team_one_name;
    canvasDiv.innerHTML = `You got it right!! ${game.team_one_name} wins this round!`;
  } else {
    game.match_one_winner = game.team_two_name;
    canvasDiv.innerHTML = `Wrong! The answer was ${game.word_one}. ${game.team_two_name} wins this round!`;
  };
}


function startRound2(){
  document.getElementById("game-answer").remove();
  document.getElementById("start-next-round-button").remove();
  paintPickYourWords(2);
  context.clearRect(0,0, canvas.width, canvas.height);
};

function completeGame(){

};

function anotherGame(){
  startGame();
  document.getElementById("start-another-game-button").remove();
  document.getElementById("punishment").remove();

};
