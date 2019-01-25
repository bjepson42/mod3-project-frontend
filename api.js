function populateCompetingForDropdown(){
  let allData = fetchData("bets");
  allData.then(res => res.json())
  .then(json => {
          let dataList = document.getElementById("betName");
        json.data.forEach(function(data){
          let newOption = `<option>${data.attributes.name}</option>`;
          dataList.innerHTML += newOption;

        })
  });
}

function saveGameToDb(gameData){
  postData(gameData, "games");
};


function saveUsersToDb(user1name, user2name){
  //data = {name: user1name},{name: user2name};
  //FIX ME WITH CUSTOM ROUTE
  data1 = {name: user1name};
  data2 = {name: user2name};
  postData(data1, "users").then(data => data.json()).then(data => {
    if (data.id) {usersObj.push(data.data);}
  });
  postData(data2, "users").then(data => data.json()).then(data => {
    if (data.id) {usersObj.push(data.data);}
    populateSideBars();
  });

}

function saveBetToDb(betName){
  data1 = {name: betName};
  postData(data1, "bets");
}

function saveWordToDb(wordName){
  data = {name: wordName};
  postData(data, "words");
}

function deleteWord(){

}


function deleteData(data,route){

}


function postData(data, route){
  return fetch(`http://localhost:3000/${route}`,
    {
      method: "POST",
      headers:
      {
        "content-type":"application/json",
        accept: "application/json"
      },
      body: JSON.stringify(data)
  })
};

function populateTeamDropdowns(){
  let allData = fetchData("users");
  allData.then(res => res.json())
  .then(json => {
          let selectUser1List = document.getElementById("selectUser1");
          let selectUser2List = document.getElementById("selectUser2");
          usersObj = json.data;
        json.data.forEach(function(data){
          let newOption = `<option>${data.attributes.name}</option>`;
          selectUser1List.innerHTML += newOption;
          selectUser2List.innerHTML += newOption;
        })
  });
}

function populateWord(){
  let allData = fetchData("words");
  allData.then(res => res.json())
  .then(json => {
          let gameWord = document.getElementById("game-word");
          let randomWord = json.data[Math.floor(Math.random()*json.data.length)];
          gameWord.value = randomWord.attributes.name;
  });
}

const fetchData = (dataType) => {
  return fetch(`http://localhost:3000/${dataType}`);
}
