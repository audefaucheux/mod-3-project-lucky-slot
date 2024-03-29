//////////////////////////////////////////// API ////////////////////////////////////////////

get = url => fetch(url).then(resp => resp.json())

post = (url, data) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(resp => resp.json())
}

patch = (url, id, data) => {
  return fetch(`${url}${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(resp => resp.json())
}

const API = { get, post, patch }

//////////////////////////////////////////// CONSTANTS ////////////////////////////////////////////

//url
const usersUrl = "http://localhost:3000/users/"

//divs
const formDiv = document.querySelector("div#form")
const gameDiv = document.querySelector("div#game-screen")
const slotMachineHeaderDiv = document.querySelector("div#slot-machine-header")
const slotMachineDiv = document.querySelector("div#slot-machine")
const spinButtonDiv = document.querySelector("div#spin-button")
const slotMachineResultMessageDiv = document.querySelector(
  "div#game-result-message"
)
const leaderboardDiv = document.querySelector("div#leaderboard-table")
const loginDiv = document.querySelector("div#back-to-login")
const welcomeDiv = document.querySelector("div#welcome")
const image1Div = document.querySelector("div#image-1")
const image2Div = document.querySelector("div#image-2")
const image3Div = document.querySelector("div#image-3")
let userTheme = ""
const audio = new Audio("sounds/slotmachinesound.wav")
const loseaudio = new Audio("sounds/lose.mp3")
const winaudio = new Audio("sounds/winaudio.wav")

//images
const spinButtonImage = "images/game/spinbutton.png"
const questionMarkBear = "images/game/question-bear_dribbble.png"
let image1 = document.querySelector("#image-1 img")
let image2 = document.querySelector("#image-2 img")
let image3 = document.querySelector("#image-3 img")
const slothImageCollection = {
  "Sloth-Theme": [
    "images/sloth-theme/javascript-ninja-sloth.png",
    "images/sloth-theme/ninja-sloth.png",
    "images/sloth-theme/red-ninja-sloth.png"
  ],
  "Cat-Theme": [
    "images/cat-theme/flying-cat.jpg",
    "images/cat-theme/mexican-cat.jpg",
    "images/cat-theme/scared-cat.jpg"
  ],
  "Duck-Theme": [
    "images/rubber-duck-theme/cloud-duck.jpg",
    "images/rubber-duck-theme/polka-dots-duck.jpg",
    "images/rubber-duck-theme/watermelon-duck.jpg"
  ],
  "George-Theme": [
    "images/george-theme/angry-george.jpg",
    "images/george-theme/happy-george.jpg",
    "images/george-theme/silly-george.jpg"
  ],
  "Flatiron-Theme": [
    "images/flatiron-theme/charly.png",
    "images/flatiron-theme/ian.png",
    "images/flatiron-theme/daniel.png"
  ],
  "Harry-Potter-Theme": [
    "images/harry-potter-theme/harrypotter.png",
    "images/harry-potter-theme/harrypotter2.png",
    "images/harry-potter-theme/harrypotter3.png"
  ],
  "Keanu-Theme": [
    "images/keanu-theme/angry-keanu.jpg",
    "images/keanu-theme/bill-and-ted-keanu.png",
    "images/keanu-theme/matrix-keanu.png"
  ],
  "South-Park-Theme": [
    "images/south-park-theme/ButtersStotch.png",
    "images/south-park-theme/cartman.png",
    "images/south-park-theme/Jimmy.png"
  ],
  "Zombie-Theme": [
    "images/zombie-theme/zombie1.jpg",
    "images/zombie-theme/zombie2.jpg",
    "images/zombie-theme/zombie3.jpg"
  ]
}

//////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////

// handle slot result

function updateUsersCredit(userData, user) {
  API.patch(usersUrl, user.id, { credit: userData }).then(checkGameOver)
}

getResult = (randomNumberArray, user) => {
  let uniqueNumberArray = [...new Set(randomNumberArray)]
  let bet = document.querySelector("#bet-header").dataset.id
  let betNum = parseInt(bet)
  if (uniqueNumberArray.length === 1) {
    renderConfetti()
    winaudio.play()
    let newCredit = user.credit + betNum * 10
    slotMachineResultMessageDiv.innerHTML =
      "🥇🥇🥇<span class='text-magical'> YOU WON ! </span>🥇🥇🥇"
    updateUsersCredit(newCredit, user)
  } else {
    let newCredit = user.credit - betNum
    slotMachineResultMessageDiv.innerHTML =
      "<span class='text-magical'>You lost </span> 😢"
    updateUsersCredit(newCredit, user)
  }
}

// game over

checkGameOver = user => {
  if (user.credit === 0) {
    removeDivChildren(spinButtonDiv)
    removeDivChildren(slotMachineHeaderDiv)
    header = document.createElement("h2")
    loseaudio.play()
    header.innerText = `Game Over!  You've run out of credits!`
    header.style.color = "darkmagenta"
    slotMachineHeaderDiv.append(header)
  } else {
    renderWelcomePage(user)
  }
}

// render betting menu

renderBetAmts = user => {
  let betDiv = document.createElement("div")
  let betHeader = document.createElement("strong")
  betHeader.id = "bet-header"
  betHeader.innerText = "Bet amount: "
  let betSpan = document.createElement("span")
  let betDecrementBtn = document.createElement("button")
  betDecrementBtn.innerText = "-"
  betDecrementBtn.className = "btn btn-primary"
  betDecrementBtn.disabled = true
  let betIncrementBtn = document.createElement("button")
  betIncrementBtn.innerText = "+"
  betIncrementBtn.className = "btn btn-primary"
  let betMaxBtn = document.createElement("button")
  betMaxBtn.innerText = "Bet MAX"
  betMaxBtn.className = "btn btn-primary"
  slotMachineHeaderDiv.append(betDiv)
  betDiv.append(betHeader, betDecrementBtn, betIncrementBtn, betMaxBtn)
  betHeader.append(betSpan)
  let betMax = user.credit
  let betMin = 10
  let betAmount = betMin

  //placeholder
  betHeader.dataset.id = betAmount
  betSpan.innerText = betAmount
  betDecrementBtn.addEventListener("click", () => {
    betIncrementBtn.disabled = false
    if (betAmount >= 20) {
      betAmount = betAmount - 10
      betHeader.dataset.id = betAmount
      betSpan.innerText = betAmount
      betAmount === 10
        ? (betDecrementBtn.disabled = true)
        : (betDecrementBtn.disabled = false)
    }
  })
  betIncrementBtn.addEventListener("click", () => {
    betDecrementBtn.disabled = false
    betAmount = betAmount + 10
    betHeader.dataset.id = betAmount
    betSpan.innerText = betAmount

    if (betAmount === betMax) {
      betIncrementBtn.disabled = true
    }
  })
  betMaxBtn.addEventListener("click", () => {
    betDecrementBtn.disabled = false
    betIncrementBtn.disabled = true
    betAmount = betMax
    betHeader.dataset.id = betAmount
    betSpan.innerText = betAmount
  })
}

getRandomNumber = () => {
  randomNumber1 = Math.floor(Math.random() * 3)
  randomNumber2 = Math.floor(Math.random() * 3)
  randomNumber3 = Math.floor(Math.random() * 3)
  let randomNumberArray = [randomNumber1, randomNumber2, randomNumber3]
  return randomNumberArray
}

// display game screen

renderImage = (index, image) => {
  image.src = slothImageCollection[userTheme][index]
  image.className = ""
}

renderSlotMachine = user => {
  let randomNumberArray = getRandomNumber() //final results array e.g. [2.1.2]
  slotMachineResultMessageDiv.innerHTML =
    "<span class='text-magical'>Spinning...</span> ⌛"
  image1.src = questionMarkBear
  image2.src = questionMarkBear
  image3.src = questionMarkBear
  image1.className = "animated infinite shake"
  image2.className = "animated infinite shake"
  image3.className = "animated infinite shake"
  setTimeout(() => renderImage(randomNumberArray[0], image1), 1000)
  setTimeout(() => renderImage(randomNumberArray[1], image2), 1400)
  setTimeout(() => renderImage(randomNumberArray[2], image3), 1900)
  setTimeout(() => getResult(randomNumberArray, user), 2000)
}

// display leaderboard//

renderLeaderboard = users => {
  const leaderboardHeader = document.createElement("h2")
  leaderboardHeader.innerText = "Leaderboard"
  const leaderboardTable = document.createElement("table")
  leaderboardTable.className = "table table-striped table-bordered"
  const leaderboardThead = document.createElement("thead")
  const leaderboardTr = document.createElement("tr")
  const leaderboardTh1 = document.createElement("th")
  leaderboardTh1.innerText = "Rank"
  const leaderboardTh2 = document.createElement("th")
  leaderboardTh2.innerText = "Username"
  const leaderboardTh3 = document.createElement("th")
  leaderboardTh3.innerText = "Credit"
  const leaderboardTbody = document.createElement("tbody")

  let orderedUsers = users.sort((a, b) =>
    a.credit < b.credit ? 1 : b.credit < a.credit ? -1 : 0
  )

  let top10Users = orderedUsers.slice(0, 9)

  for (let i = 0; i < top10Users.length; i++) {
    const leaderboardBodyTr = document.createElement("tr")
    const leaderboardTd1 = document.createElement("td")
    leaderboardTd1.innerText = i + 1
    const leaderboardTd2 = document.createElement("td")
    leaderboardTd2.innerText = top10Users[i].username
    const leaderboardTd3 = document.createElement("td")
    leaderboardTd3.innerText = `£${top10Users[i].credit}`

    leaderboardTbody.appendChild(leaderboardBodyTr)
    leaderboardBodyTr.append(leaderboardTd1, leaderboardTd2, leaderboardTd3)
  }

  leaderboardDiv.append(leaderboardHeader, leaderboardTable)
  leaderboardTable.append(leaderboardThead, leaderboardTbody)
  leaderboardThead.appendChild(leaderboardTr)
  leaderboardTr.append(leaderboardTh1, leaderboardTh2, leaderboardTh3)
}

// welcome page

removeDivChildren = div => {
  while (div.firstChild) {
    div.firstChild.remove()
  }
}

renderWelcomePage = user => {
  removeDivChildren(formDiv)
  removeDivChildren(welcomeDiv)
  removeDivChildren(loginDiv)
  removeDivChildren(slotMachineHeaderDiv)
  removeDivChildren(leaderboardDiv)
  removeDivChildren(spinButtonDiv)

  slotMachineDiv.style.visibility = "visible"

  let newH2 = document.createElement("h2")
  newH2.setAttribute("data-user-id", user.id)
  newSpan = document.createElement("span")
  newSpan.className = "credit-span"
  newSpan.innerText = `£${user.credit}`
  newH2.innerText = `Hi ${user.username}. Your current credit is `

  let spinButton = document.createElement("img")
  spinButton.src = spinButtonImage
  spinButton.className = "spin-button"

  slotMachineHeaderDiv.append(newH2)
  newH2.append(newSpan)
  spinButtonDiv.append(spinButton)
  renderBetAmts(user)

  let loginBtn = document.createElement("button")
  loginBtn.className = "btn btn-danger"
  loginBtn.innerText = "EXIT"
  loginDiv.append(loginBtn)
  loginBtn.addEventListener("click", () => location.reload())

  if (!slotMachineResultMessageDiv.firstChild) {
    slotMachineResultMessageDiv.innerHTML =
      "⬆️⬆️⬆️ <span class='text-magical'>Spin to play !!</span> ⬆️⬆️⬆️"
  }

  if (!image1Div.firstChild) {
    image1 = document.createElement("img")
    image1.src = "images/game/question-bear_dribbble.png"
    image2 = document.createElement("img")
    image2.src = "images/game/question-bear_dribbble.png"
    image3 = document.createElement("img")
    image3.src = "images/game/question-bear_dribbble.png"
    image1Div.append(image1)
    image2Div.append(image2)
    image3Div.append(image3)
  }

  API.get(usersUrl).then(renderLeaderboard)

  spinButton.addEventListener("click", event => {
    audio.play()
    // spinButton.className = "spin-button animated tada";
    // if (user.credit >= 10) {
    renderSlotMachine(user)
    // } else {
    //   console.log("You are too poor to play");
    // }
  })
}

// display form

handleSubmit = username => {
  API.get(usersUrl).then(result => {
    if (result.find(element => element.username === username)) {
      let user = result.find(element => element.username === username)
      checkGameOver(user)
    } else {
      API.post(usersUrl, { username: username }).then(renderWelcomePage)
    }
  })
}

addOptionsToDropDown = themeName => {
  const themeDropDown = document.querySelector("select#theme-dropdown")
  let newThemeOption = document.createElement("option")
  newThemeOption.value = themeName.replace(/\s+/g, "-")
  newThemeOption.innerText = themeName
  themeDropDown.append(newThemeOption)
}

displayForm = event => {
  slotMachineDiv.style.visibility = "hidden"

  const welcomeHeader = document.createElement("h1")
  welcomeHeader.innerText = "Welcome to the Lucky Sloth!"
  welcomeDiv.append(welcomeHeader)

  const newForm = document.createElement("form")
  newForm.setAttribute("id", "create-user-form")

  const formContentDiv = document.createElement("div")
  formContentDiv.className = "form-container"

  const inputSubDiv = document.createElement("div")
  const usernameInput = document.createElement("input")
  usernameInput.type = "text"
  usernameInput.className = "form-container-items"
  usernameInput.placeholder = "enter username..."

  const dropDownSubDiv = document.createElement("div")
  dropDownSubDiv.className = "form-container-items"
  const themeDropDown = document.createElement("select")
  themeDropDown.id = "theme-dropdown"
  themeDropDown.className = "form-container-items"

  const buttonSubDiv = document.createElement("div")
  buttonSubDiv.className = "form-container-items"
  const submitButton = document.createElement("input")
  submitButton.type = "submit"
  submitButton.className = "form-container-items btn btn-info"
  submitButton.value = "PLAY"

  const moneySlothGif = document.createElement("img")
  moneySlothGif.src = "https://media3.giphy.com/media/BCtjVLKRoFVza/source.gif"

  formDiv.append(newForm, moneySlothGif)
  newForm.append(formContentDiv)
  formContentDiv.append(inputSubDiv, dropDownSubDiv, buttonSubDiv)
  inputSubDiv.append(usernameInput)
  dropDownSubDiv.append(themeDropDown)
  buttonSubDiv.append(submitButton)

  addOptionsToDropDown("Sloth Theme")
  addOptionsToDropDown("Cat Theme")
  addOptionsToDropDown("Duck Theme")
  addOptionsToDropDown("Flatiron Theme")
  addOptionsToDropDown("George Theme")
  addOptionsToDropDown("Harry Potter Theme")
  addOptionsToDropDown("Keanu Theme")
  addOptionsToDropDown("South Park Theme")
  addOptionsToDropDown("Zombie Theme")

  newForm.addEventListener("submit", validateForm)
}

validateForm = event => {
  event.preventDefault()
  let username = event.target[0].value
  userTheme = event.target[1].value
  if (username === "") {
    alert("You must enter a username")
  } else {
    handleSubmit(username)
  }
}

//////////////////////////////////////////// EVENT LISTENERS ////////////////////////////////////////////

document.body.onload = displayForm

// confetti
const renderConfetti = () => {
  let end = Date.now() + 1 * 1000
  let interval = setInterval(function() {
    if (Date.now() > end) {
      return clearInterval(interval)
    }
    confetti({
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      shapes: ["square"],
      origin: {
        x: Math.random(),
        // since they fall down, start a bit higher than random
        y: Math.random() - 0.2
      }
    })
  }, 200)
}
