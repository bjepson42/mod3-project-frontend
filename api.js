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
          let gameWord = document.getElementById("game-title");
          let randomWord = json.data[Math.floor(Math.random()*json.data.length)];
          gameWord.value = randomWord.attributes.name;
  });
}

const fetchData = (dataType) => {
  return fetch(`http://localhost:3000/${dataType}`);
}
