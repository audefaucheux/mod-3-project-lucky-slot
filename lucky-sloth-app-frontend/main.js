////////////////////// API //////////////////////

get = url => fetch(url).then(resp => resp.json());

post = (url, data) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(resp => resp.json());
};

patch = (url, id, data) => {
  return fetch(`${url}${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(resp => resp.json());
};

const API = { get, post, patch };

////////////////////// CONSTANTS //////////////////////

const usersUrl = "http://localhost:3000/users/";
const formDiv = document.querySelector("div#form");
const gameDiv = document.querySelector("div#game-screen");
const slotMachineHeaderDiv = document.querySelector("div#slot-machine-header");
const slotMachineDiv = document.querySelector("div#slot-machine");
const slotMachineResultMessageDiv = document.querySelector(
  "div#game-result-message"
);
const leaderboardDiv = document.querySelector("div#leaderboard-table");
const loginDiv = document.querySelector("div#back-to-login");
const welcomeDiv = document.querySelector("div#welcome")
const slothImageArray = ["images/sloth-theme/javascript-ninja-sloth.png", "images/sloth-theme/ninja-sloth.png", "images/sloth-theme/red-ninja-sloth.png" ]

////////////////////// FUNCTIONS //////////////////////

// handle slot result

function updateUsersCredit(userData, user) {
  API.patch(usersUrl, user.id, { credit: userData }).then(renderWelcomePage);
}

getResult = (randomNumberArray, user) => {
  let uniqueNumberArray = [...new Set(randomNumberArray)];
  let bet = document.querySelector("#bet-header").dataset.id;
  let betNum = parseInt(bet);
  if (uniqueNumberArray.length === 1) {
    let newCredit = user.credit + betNum * 5;
    slotMachineResultMessageDiv.innerText = "You WON";
    updateUsersCredit(newCredit, user);
  } else {
    let newCredit = user.credit - betNum;
    slotMachineResultMessageDiv.innerText = "You are a looser";
    updateUsersCredit(newCredit, user);
  }
};

renderBetAmts = user => {
  let betDiv = document.createElement("div");
  let betHeader = document.createElement("h3");
  betHeader.id = "bet-header";
  let betDecrementBtn = document.createElement("button");
  betDecrementBtn.innerText = "-";
  let betIncrementBtn = document.createElement("button");
  betIncrementBtn.innerText = "+";
  let betMaxBtn = document.createElement("button");
  betMaxBtn.innerText = "Bet MAX";
  slotMachineHeaderDiv.append(betDiv);
  betDiv.append(betHeader, betDecrementBtn, betIncrementBtn, betMaxBtn);
  let betMax = user.credit;
  let betMin = 10;
  let betAmount = betMin;
  //placeholder
  betHeader.dataset.id = betAmount;
  betHeader.innerText = `You are betting ${betAmount}`;
  betDecrementBtn.addEventListener("click", () => {
    if (betAmount >= 20) {
      betAmount = betAmount - 10;
      betHeader.dataset.id = betAmount;
      betHeader.innerText = `You are betting ${betAmount}`;
    } else {
      alert(`The Minimum Bet is £${betMin}`);
    }
  });
  betIncrementBtn.addEventListener("click", () => {
    if (betAmount >= betMax) {
      alert(`The Maximum Bet is £${betMax}`);
    } else {
      betAmount = betAmount + 10;
      betHeader.dataset.id = betAmount;
      betHeader.innerText = `You are betting ${betAmount}`;
    }
  });
  betMaxBtn.addEventListener("click", () => {
    betAmount = betMax;
    betHeader.dataset.id = betAmount;
    betHeader.innerText = `You are betting ${betAmount}`;
  });
};

getRandomNumber = () => {
  randomNumber1 = Math.floor(Math.random() * 3);
  randomNumber2 = Math.floor(Math.random() * 3);
  randomNumber3 = Math.floor(Math.random() * 3);
  let randomNumberArray = [randomNumber1, randomNumber2, randomNumber3];
  return randomNumberArray;
};

// display game screen

renderSlotMachine = user => {
  while (slotMachineDiv.firstChild) {
    slotMachineDiv.firstChild.remove();
  }

  let randomNumberDivContainer = document.createElement("div");
  randomNumberDivContainer.className = "container";
  let randomNumberDivRow = document.createElement("div");
  randomNumberDivRow.className = "row";
  let randomNumberArray = getRandomNumber();

  randomNumberArray.forEach(element => {
    let randomNumberDivCol = document.createElement("div");
    randomNumberDivCol.className = "col-sm";
    let image = document.createElement("img")
    image.src = slothImageArray[element]
    randomNumberDivCol.append(image)
    randomNumberDivRow.appendChild(randomNumberDivCol);
  });

  slotMachineDiv.append(randomNumberDivContainer);
  randomNumberDivContainer.append(randomNumberDivRow);
  getResult(randomNumberArray, user);
};

// display leaderboard//

renderLeaderboard = users => {
  const leaderboardTable = document.createElement("table");
  // leaderboardTable.className = "table table-striped"
  const leaderboardThead = document.createElement("thead");
  const leaderboardTr = document.createElement("tr");
  const leaderboardTh1 = document.createElement("th");
  leaderboardTh1.innerText = "Username";
  const leaderboardTh2 = document.createElement("th");
  leaderboardTh2.innerText = "Credit";
  const leaderboardTbody = document.createElement("tbody");

  let orderedUsers = users.sort((a, b) =>
    a.credit < b.credit ? 1 : b.credit < a.credit ? -1 : 0
  );

  orderedUsers.slice(0, 9).forEach(user => {
    const leaderboardBodyTr = document.createElement("tr");
    const leaderboardTd1 = document.createElement("td");
    leaderboardTd1.innerText = user.username;
    const leaderboardTd2 = document.createElement("td");
    leaderboardTd2.innerText = user.credit;

    leaderboardTbody.appendChild(leaderboardBodyTr);
    leaderboardBodyTr.append(leaderboardTd1, leaderboardTd2);
  });

  leaderboardDiv.appendChild(leaderboardTable);
  leaderboardTable.append(leaderboardThead, leaderboardTbody);
  leaderboardThead.appendChild(leaderboardTr);
  leaderboardTr.append(leaderboardTh1, leaderboardTh2);
};
// welcome page 
renderWelcomePage = user => {
  while (formDiv.firstChild) {
    formDiv.firstChild.remove();
  }
  
  if (welcomeDiv.childElementCount !== 0) {
    welcomeDiv.firstChild.remove()
  }

  while (loginDiv.firstChild) {
    loginDiv.firstChild.remove();
  }

  if (slotMachineHeaderDiv.childElementCount !== 0) {
    while (slotMachineHeaderDiv.firstChild) {
      slotMachineHeaderDiv.firstChild.remove();
    }
  }
  if (leaderboardDiv.childElementCount !== 0) {
    while (leaderboardDiv.firstChild) {
      leaderboardDiv.firstChild.remove();
    }
  }

  let newH2 = document.createElement("h2");
  newH2.setAttribute("data-user-id", user.id);
  newH2.innerText = `Hi ${user.username}. Your current credit is £${user.credit}`;

  let spinButton = document.createElement("button");
  spinButton.innerText = "SPIN";

  slotMachineHeaderDiv.append(newH2, spinButton);
  renderBetAmts(user);

  let loginBtn = document.createElement("button");
  loginBtn.innerText = "Log Out";
  loginDiv.append(loginBtn);
  loginBtn.addEventListener("click", () => location.reload());

  API.get(usersUrl).then(renderLeaderboard);

  spinButton.addEventListener("click", event => {
    if (user.credit >= 10) {
      renderSlotMachine(user);
    } else {
      console.log("You are too poor to play");
    }
  });
};

// display form

handleSubmit = username => {
  API.get(usersUrl).then(result => {
    if (result.find(element => element.username === username)) {
      let user = result.find(element => element.username === username);
      renderWelcomePage(user);
    } else {
      API.post(usersUrl, { username: username }).then(renderWelcomePage);
    }
  });
};

displayForm = event => {
  const welcomeHeader = document.createElement("h1")
  welcomeHeader.innerText = "Welcome to the Lucky Sloth!"
  welcomeDiv.append(welcomeHeader)
  
  const newForm = document.createElement("form");
  newForm.setAttribute("id", "create-user-form");

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.placeholder = "enter username...";

  const submitButton = document.createElement("input");
  submitButton.type = "submit";
  submitButton.value = "Create User";

  formDiv.appendChild(newForm);
  newForm.append(usernameInput, submitButton);

  newForm.addEventListener("submit", validateForm);
};

validateForm = event => {
  event.preventDefault();
  let username = event.target[0].value;
  if (username === "") {
    alert("You must enter a username");
  } else {
    handleSubmit(username);
  }
};

////////////////////// EVENT LISTENERS //////////////////////

document.body.onload = displayForm;
