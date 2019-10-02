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
const spinButtonDiv = document.querySelector("div#spin-button");
const slotMachineResultMessageDiv = document.querySelector(
  "div#game-result-message"
);
const leaderboardDiv = document.querySelector("div#leaderboard-table");
const loginDiv = document.querySelector("div#back-to-login");
const welcomeDiv = document.querySelector("div#welcome");
const slothImageArray = [
  "images/sloth-theme/javascript-ninja-sloth.png",
  "images/sloth-theme/ninja-sloth.png",
  "images/sloth-theme/red-ninja-sloth.png"
];
const spinButtonImage = "images/game/start-button.jpg";
const image1 = document.querySelector("#image-1 img");
const image2 = document.querySelector("#image-2 img");
const image3 = document.querySelector("#image-3 img");
const questionMarkBear = "images/game/question-bear_dribbble.png"

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

// render betting menu

renderBetAmts = user => {
  let betDiv = document.createElement("div");
  let betHeader = document.createElement("strong");
  betHeader.id = "bet-header";
  betHeader.innerText = "Bet amount: ";
  let betSpan = document.createElement("span");
  let betDecrementBtn = document.createElement("button");
  betDecrementBtn.innerText = "-";
  betDecrementBtn.className = "btn btn-primary";
  betDecrementBtn.disabled = true;
  let betIncrementBtn = document.createElement("button");
  betIncrementBtn.innerText = "+";
  betIncrementBtn.className = "btn btn-primary";
  let betMaxBtn = document.createElement("button");
  betMaxBtn.innerText = "Bet MAX";
  betMaxBtn.className = "btn btn-primary";
  slotMachineHeaderDiv.append(betDiv);
  betDiv.append(betHeader, betDecrementBtn, betIncrementBtn, betMaxBtn);
  betHeader.append(betSpan);
  let betMax = user.credit;
  let betMin = 10;
  let betAmount = betMin;

  //placeholder
  betHeader.dataset.id = betAmount;
  betSpan.innerText = betAmount;
  betDecrementBtn.addEventListener("click", () => {
    betIncrementBtn.disabled = false;
    if (betAmount >= 20) {
      betAmount = betAmount - 10;
      betHeader.dataset.id = betAmount;
      betSpan.innerText = betAmount;
      betAmount === 10
        ? (betDecrementBtn.disabled = true)
        : (betDecrementBtn.disabled = false);
    }
  });
  betIncrementBtn.addEventListener("click", () => {
    betDecrementBtn.disabled = false;
    betAmount = betAmount + 10;
    betHeader.dataset.id = betAmount;
    betSpan.innerText = betAmount;

    if (betAmount === betMax) {
      betIncrementBtn.disabled = true;
    }
  });
  betMaxBtn.addEventListener("click", () => {
    betDecrementBtn.disabled = false;
    betIncrementBtn.disabled = true;
    betAmount = betMax;
    betHeader.dataset.id = betAmount;
    betSpan.innerText = betAmount;
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

renderImage = (index, image) => {
  image.src = slothImageArray[index];
};

renderSlotMachine = user => {
  let randomNumberArray = getRandomNumber(); //final results array e.g. [2.1.2]

  image1.src = questionMarkBear
  image2.src = questionMarkBear
  image3.src = questionMarkBear
  setTimeout(() => renderImage(randomNumberArray[0], image1), 500);
  setTimeout(() => renderImage(randomNumberArray[1], image2), 1000);
  setTimeout(() => renderImage(randomNumberArray[2], image3), 1700);
  setTimeout(() => getResult(randomNumberArray, user), 2000);
};

// display leaderboard//

renderLeaderboard = users => {
  const leaderboardHeader = document.createElement("h2");
  leaderboardHeader.innerText = "Leaderboard";
  const leaderboardTable = document.createElement("table");
  leaderboardTable.className = "table table-striped table-bordered";
  const leaderboardThead = document.createElement("thead");
  const leaderboardTr = document.createElement("tr");
  const leaderboardTh1 = document.createElement("th");
  leaderboardTh1.innerText = "Rank";
  const leaderboardTh2 = document.createElement("th");
  leaderboardTh2.innerText = "Username";
  const leaderboardTh3 = document.createElement("th");
  leaderboardTh3.innerText = "Credit";
  const leaderboardTbody = document.createElement("tbody");

  let orderedUsers = users.sort((a, b) =>
    a.credit < b.credit ? 1 : b.credit < a.credit ? -1 : 0
  );

  let top10Users = orderedUsers.slice(0, 9);

  for (let i = 0; i < top10Users.length; i++) {
    const leaderboardBodyTr = document.createElement("tr");
    const leaderboardTd1 = document.createElement("td");
    leaderboardTd1.innerText = i + 1;
    const leaderboardTd2 = document.createElement("td");
    leaderboardTd2.innerText = top10Users[i].username;
    const leaderboardTd3 = document.createElement("td");
    leaderboardTd3.innerText = `£${top10Users[i].credit}`;

    leaderboardTbody.appendChild(leaderboardBodyTr);
    leaderboardBodyTr.append(leaderboardTd1, leaderboardTd2, leaderboardTd3);
  }

  leaderboardDiv.append(leaderboardHeader, leaderboardTable);
  leaderboardTable.append(leaderboardThead, leaderboardTbody);
  leaderboardThead.appendChild(leaderboardTr);
  leaderboardTr.append(leaderboardTh1, leaderboardTh2, leaderboardTh3);
};

// welcome page

removeDivChildren = div => {
  while (div.firstChild) {
    div.firstChild.remove();
  }
};

renderWelcomePage = user => {
  removeDivChildren(formDiv);
  removeDivChildren(welcomeDiv);
  removeDivChildren(loginDiv);
  removeDivChildren(slotMachineHeaderDiv);
  removeDivChildren(leaderboardDiv);
  removeDivChildren(spinButtonDiv);

  slotMachineDiv.style.visibility = "visible";

  let newH2 = document.createElement("h2");
  newH2.setAttribute("data-user-id", user.id);
  newH2.innerText = `Hi ${user.username}. Your current credit is £${user.credit}`;

  let spinButton = document.createElement("img");
  spinButton.src = spinButtonImage;
  spinButton.className = "spin-button";

  slotMachineHeaderDiv.append(newH2);
  spinButtonDiv.append(spinButton);
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
  slotMachineDiv.style.visibility = "hidden";

  const welcomeHeader = document.createElement("h1");
  welcomeHeader.innerText = "Welcome to the Lucky Sloth!";
  welcomeDiv.append(welcomeHeader);

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
