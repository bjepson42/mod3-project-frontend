function populateCompetingForDropdown(){
  let allData = fetchData("bets");
  allData.then(res => res.json())
  .then(json => {
          let dataList = document.getElementById("betName");
        json.data.forEach(function(data){
          let newOption = `<option>${data.attributes.bet}</option>`;
          dataList.innerHTML += newOption;

        })
  });
}

function saveUsersToDb(user1name, user2name){
  //data = {name: user1name},{name: user2name};
  //FIX ME WITH CUSTOM ROUTE
  data1 = {name: user1name};
  data2 = {name: user2name};
  postData(data1, "users");
  postData(data2, "users");
}

function saveBetToDb(betName){
  data1 = {bet: betName};
  postData(data1, "bets");
}

function saveWordsToDb(word1name, word2name){
  //data = {name: user1name},{name: user2name};
  //FIX ME WITH CUSTOM ROUTE
  data1 = {name: word1name};
  data2 = {name: word2name};
  postData(data1, "words");
  postData(data2, "words");
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
          let gameWord1 = document.getElementById("game-1-word");
          let gameWord2 = document.getElementById("game-2-word")
          let randomWord1 = json.data[Math.floor(Math.random()*json.data.length)];
          let randomWord2 = json.data[Math.floor(Math.random()*json.data.length)];
          gameWord1.value = randomWord1.attributes.name;
          gameWord2.value = randomWord2.attributes.name;
  });
}

const fetchData = (dataType) => {
  return fetch(`http://localhost:3000/${dataType}`);
}
