"use strict";
const textWin = document.querySelector(".textWinner");
const titl = document.querySelector("#title");
const mex = document.querySelector(".message");
const inputText = document.querySelector(".inputDigi");
const btnDigi = document.querySelector(".btn--get");
const btnBattle = document.querySelector(".btn--battle");
const btnRestart = document.querySelector(".btn--restart");
const btnPlayAgain = document.querySelector(".btn--playAgain");
const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");
const score0El = document.querySelector("#score--0");
const score1El = document.querySelector("#score--1");
const current0El = document.querySelector("#current--0");
const current1El = document.querySelector("#current--1");
const imageContainerPl0 = document.querySelector("#imageContainer--1");
const imageContainerPl1 = document.querySelector("#imageContainer--0");
const textStrength0 = document.querySelector("#strength--1");
const textStrength1 = document.querySelector("#strength--0");

let activePlayer, strength, score, playing;

//to initialize and reset the game
const init = function () {
  activePlayer = 0;
  score = [0, 0];
  strength = [0, 0];
  playing = true;
  titl.textContent = "Digigame";
  btnDigi.disabled = false;
  btnBattle.disabled = true;
  current0El.textContent = 0;
  current1El.textContent = 0;
  textWin.textContent = "";
  mex.textContent = "";
};
init();

//to restart after clicking on reset
const restart = function () {
  btnDigi.disabled = false;
  btnBattle.disabled = false;
  activePlayer = 0;
  textStrength0.textContent = "";
  textStrength1.textContent = "";
  const images = document.getElementById("images");
  if (images) images.remove();
  titl.textContent = "Digigame";
};

const updateScore = function () {
  current1El.textContent = score[0];
  current0El.textContent = score[1];
};

//checking strength
const checkingstrength = function () {
  if (strength[0] > strength[1]) {
    titl.textContent = "player1 wins";
    score[0]++;
  }
  if (strength[0] < strength[1]) {
    score[1]++;
    titl.textContent = "player2 wins";
  }
  if (strength[0] === strength[1]) {
    titl.textContent = "noone";
  }
  updateScore();
};

const checkingWinner = function () {
  if (score[0] > score[1] && score[0] === 3) {
    textWin.textContent = "player 1 wins THE PLAY";
    playing = false;
  }
  if (score[0] < score[1] && score[1] === 3) {
    textWin.textContent = "player 2 win THE PLAY";
    playing = false;
  }
};

const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle("player--active");
  player1El.classList.toggle("player--active");
};

function getRandomArbitrary(min, max) {
  return Math.trunc(Math.random() * (max - min)) + min;
}

const renderImg = function (data) {
  const html = ` 
  <div class="image" id="images">
    <h2 class="diginame"> ${data.name} <h2>
      <img src= ${data.img} class="digiimg">
  </div>`;
  document
    .getElementById(`imageContainer--${activePlayer}`)
    .insertAdjacentHTML("afterend", html);
};

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error("Request took too long!"));
    }, sec * 1000);
  });
};

const callDigi = async function (name) {
  try {
    const res = await Promise.race([
      fetch(`https://digimon-api.vercel.app/api/digimon/name/${name}`),
      timeout(5),
    ]);
    if (!name) return;
    if (!res.ok) {
      throw new Error(
        "Sorry your digimon was not found, please check the name and press play"
      );
    }
    const [data] = await res.json();
    if (data.level === "In Training") data.strength = getRandomArbitrary(1, 10);
    if (data.level === "Fresh") data.strength = getRandomArbitrary(11, 20);
    if (data.level === "Rookie") data.strength = getRandomArbitrary(21, 30);
    if (data.level === "Champion") data.strength = getRandomArbitrary(31, 40);
    if (data.level === "Ultimate") data.strength = getRandomArbitrary(41, 50);
    if (data.level === "Mega") data.strength = getRandomArbitrary(51, 60);
    if (data.level === "Armor") data.strength = getRandomArbitrary(61, 70);
    if (activePlayer === 0) strength[1] = data.strength;
    if (activePlayer === 1) strength[0] = data.strength;
    renderImg(data);
  } catch (error) {
    mex.innerHTML = error.message;
  }
};

btnDigi.addEventListener("click", function (e) {
  e.preventDefault();
  if (playing) {
    const digi = inputText.value;
    callDigi(digi);
    switchPlayer();
    updateScore();
    if (activePlayer === 0) {
      btnDigi.disabled = true;
    }
    btnBattle.disabled = false;
  }
});

btnBattle.addEventListener("click", function (e) {
  if (playing) {
    e.preventDefault();
    btnBattle.disabled = true;
    textStrength0.textContent = `strength = ${strength[0]}`;
    textStrength1.textContent = `strength = ${strength[1]}`;
    updateScore();
    checkingstrength();
    checkingWinner();
  }
});

btnRestart.addEventListener("click", function (e) {
  if (playing) {
    e.preventDefault();
    restart();
    updateScore();
  }
});

btnPlayAgain.addEventListener("click", function (e) {
  e.preventDefault();
  const images = document.getElementById("images");
  if (images) images.remove();
  updateScore();
  init();
});
