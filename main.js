const grid = document.querySelector(".grid");
const doodler = document.createElement("div");
let doodlerLeft = 50;
let startPoint = 150;
let doodlerBottom = startPoint;
let isGameOver = false;
let platformCount = 5;
let platforms = [];
let upTimer;
let downTimer;
let leftTimer;
let rightTimer;
let isJumping = false;
let isGoingLeft = false;
let isGoingRight = false;
let score = 0;

class Platform {
  constructor(platformBottom) {
    this.bottom = platformBottom;
    // Grid width - platform width
    this.left = Math.random() * 315;
    this.visual = document.createElement("div");

    const visual = this.visual;
    visual.classList.add("platform");
    visual.style.left = this.left + "px";
    visual.style.bottom = this.bottom + "px";
    grid.appendChild(visual);
  }
}

function createDoodler() {
  grid.appendChild(doodler);
  doodler.classList.add("doodler");
  doodlerLeft = platforms[0].left;
  doodler.style.left = doodlerLeft + "px";
  doodler.style.bottom = doodlerBottom + "px";
}

function createPlatforms() {
  for (let i = 0; i < platformCount; i++) {
    // Grid height / number
    let platformGap = 600 / platformCount;
    let newPlatformBottom = 100 + i * platformGap;
    let newPlatform = new Platform(newPlatformBottom);
    platforms.push(newPlatform);
  }
}

function movePlatforms() {
  if (doodlerBottom > 200) {
    platforms.forEach((platform) => {
      platform.bottom -= 4;
      let visual = platform.visual;
      visual.style.bottom = platform.bottom + "px";

      if (platform.bottom < 10) {
        let firstPlatform = platforms[0].visual;
        firstPlatform.classList.remove("platform");
        platforms.shift();
        score++;
        let newPlatform = new Platform(600);
        platforms.push(newPlatform);
      }
    });
  }
}

function jump() {
  clearInterval(downTimer);
  isJumping = true;
  upTimer = setInterval(() => {
    doodlerBottom += 20;
    doodler.style.bottom = doodlerBottom + "px";
    if (doodlerBottom > startPoint + 200) {
      fall();
    }
  }, 30);
}

function fall() {
  clearInterval(upTimer);
  isJumping = false;
  downTimer = setInterval(() => {
    doodlerBottom -= 5;
    doodler.style.bottom = doodlerBottom + "px";
    if (doodlerBottom <= 0) {
      gameOver();
    }
    // Collision check
    platforms.forEach((platform) => {
      if (
        doodlerBottom >= platform.bottom &&
        doodlerBottom <= platform.bottom + 15 &&
        doodlerLeft + 60 >= platform.left &&
        doodlerLeft <= platform.left + 85 &&
        !isJumping
      ) {
        startPoint = doodlerBottom;
        jump();
      }
    });
  }, 30);
}

function gameOver() {
  isGameOver = true;
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  grid.innerHTML = score;
  clearInterval(upTimer);
  clearInterval(downTimer);
  clearInterval(rightTimer);
  clearInterval(leftTimer);
}

function controls(e) {
  // Fix keys
  if (e.key === "ArrowLeft") {
    moveLeft();
  } else if (e.key === "ArrowRight") {
    moveRight();
  } else if (e.key === "ArrowUp") {
    moveStraight();
  }
}

function moveStraight() {
  isGoingRight = false;
  isGoingLeft = false;
  clearInterval(rightTimer);
  clearInterval(leftTimer);
}

function moveLeft() {
  if (isGoingRight) {
    clearInterval(rightTimer);
    isGoingRight = false;
  }
  isGoingLeft = true;
  leftTimer = setInterval(() => {
    if (doodlerLeft >= 0) {
      doodlerLeft -= 5;
      doodler.style.left = doodlerLeft + "px";
    }
  }, 30);
}

function moveRight() {
  if (isGoingLeft) {
    clearInterval(leftTimer);
    isGoingLeft = false;
  }
  isGoingRight = true;
  rightTimer = setInterval(() => {
    if (doodlerLeft <= 340) {
      doodlerLeft += 5;
      doodler.style.left = doodlerLeft + "px";
    }
  }, 30);
}

function start() {
  if (!isGameOver) {
    createPlatforms();
    createDoodler();
    setInterval(movePlatforms, 30);
    jump();
    document.addEventListener("keyup", controls);
  }
}

// Add a btn
start();
