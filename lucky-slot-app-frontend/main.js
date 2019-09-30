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

const API = { get, post };

// CONSTANTS
const usersUrl = "http://localhost:3000/users/";
const formDiv = document.querySelector("div#form");
const gameDiv = document.querySelector("div#game-screen");
const slotMachineHeaderDiv = document.querySelector("div#slot-machine-header")
const slotMachineDiv = document.querySelector("div#slot-machine");

// FUNCTIONS

getRandomNumber = () => {
  randomNumber1 = Math.floor(Math.random() * 3);
  randomNumber2 = Math.floor(Math.random() * 3);
  randomNumber3 = Math.floor(Math.random() * 3);
  let randomNumberArray = [randomNumber1, randomNumber2, randomNumber3];
  return randomNumberArray;
};

renderSlotMachine = () => {
  while(slotMachineDiv.firstChild) {
    slotMachineDiv.firstChild.remove()
  }

  let randomNumberArray = getRandomNumber();

  randomNumberArray.forEach(element => {
    let randomNumberP = document.createElement("p");
    randomNumberP.innerText = element;
    slotMachineDiv.appendChild(randomNumberP);
  });
};

renderWelcomePage = user => {
  while (formDiv.firstChild) {
    formDiv.firstChild.remove();
  }

  let newH2 = document.createElement("h2");
  newH2.innerText = `Hi ${user.username}. Your current credit is ${user.credit}`;

  let spinButton = document.createElement("button")
  spinButton.innerText = "SPIN !!"

  slotMachineHeaderDiv.append(newH2, spinButton);

  spinButton.addEventListener("click", event => renderSlotMachine())
};

handleSubmit = event => {
  event.preventDefault();
  let name = event.target[0].value;

  API.get(usersUrl).then(result => {
    if (result.find(element => element.username === name)) {
      let user = result.find(element => element.username === name);
      renderWelcomePage(user);
    } else {
      let user = API.post(usersUrl, { username: name }).then(renderWelcomePage);
      renderWelcomePage(user);
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
