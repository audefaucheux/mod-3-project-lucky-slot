// API

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

// CONSTANTS
const usersUrl = "http://localhost:3000/users/";
const formDiv = document.querySelector("div#form");
const gameDiv = document.querySelector("div#game-screen");
const slotMachineHeaderDiv = document.querySelector("div#slot-machine-header");
const slotMachineDiv = document.querySelector("div#slot-machine");
const slotMachineResultMessageDiv = document.querySelector(
  "div#game-result-message"
);

// FUNCTIONS

function updateUsersCredit(userData, user) {
  API.patch(usersUrl, user.id, { credit: userData }).then(renderWelcomePage);
}

getResult = (randomNumberArray, user) => {
  let uniqueNumberArray = [...new Set(randomNumberArray)];
  if (uniqueNumberArray.length === 1) {
    newCredit = user.credit + 50;
    updateUsersCredit(newCredit, user);
    slotMachineResultMessageDiv.innerText = "You WON";
  } else {
    newCredit = user.credit - 10;
    updateUsersCredit(newCredit, user);
    slotMachineResultMessageDiv.innerText = "You are a looser";
  }
};

getRandomNumber = () => {
  randomNumber1 = Math.floor(Math.random() * 3);
  randomNumber2 = Math.floor(Math.random() * 3);
  randomNumber3 = Math.floor(Math.random() * 3);
  let randomNumberArray = [randomNumber1, randomNumber2, randomNumber3];
  return randomNumberArray;
};

renderSlotMachine = user => {
  while (slotMachineDiv.firstChild) {
    slotMachineDiv.firstChild.remove();
  }

  let randomNumberArray = getRandomNumber();

  randomNumberArray.forEach(element => {
    let randomNumberP = document.createElement("p");
    randomNumberP.innerText = element;
    slotMachineDiv.appendChild(randomNumberP);
  });
  getResult(randomNumberArray, user);
};

renderWelcomePage = user => {
  while (formDiv.firstChild) {
    formDiv.firstChild.remove();
  }

  if (slotMachineHeaderDiv.childElementCount !== 0) {
    while(slotMachineHeaderDiv.firstChild) {
      slotMachineHeaderDiv.firstChild.remove()
    }
  }

  let newH2 = document.createElement("h2");
  newH2.setAttribute("data-user-id", user.id);
  newH2.innerText = `Hi ${user.username}. Your current credit is £${user.credit}`;

  let spinButton = document.createElement("button");
  spinButton.innerText = "SPIN FOR £10";

  slotMachineHeaderDiv.append(newH2, spinButton);

  spinButton.addEventListener("click", event => {
    if (user.credit >= 10) {
      renderSlotMachine(user);
    } else {
      console.log("You are too poor to play");
    }
  });
};

handleSubmit = event => {
  event.preventDefault();
  let name = event.target[0].value;

  API.get(usersUrl).then(result => {
    if (result.find(element => element.username === name)) {
      let user = result.find(element => element.username === name);
      renderWelcomePage(user);
    } else {
      API.post(usersUrl, { username: name }).then(renderWelcomePage);
    }
  });
};

displayForm = event => {
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

  newForm.addEventListener("submit", handleSubmit);
};

// EVENT LISTENERS
document.body.onload = displayForm;
