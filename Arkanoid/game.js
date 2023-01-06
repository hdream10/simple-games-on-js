let canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 700;
canvas.height = 600;

const w = canvas.width;
const h = canvas.height;
let stepPlatform = 10;
let dir;
let bricks = new Array();
const brickW = 40,
  brickH = 20;

let ball = {
  size: 8,
  x: w / 2,
  y: h / 2,
  dx: 5,
  dy: 5,
};

const platform = {
  height: 4,
  width: 120,
  x: w / 2 - 60,
  y: h - 20,
};

class BricksClass {
  constructor(x, y) {
    this.height = brickH;
    this.width = brickW;
    this.x = x;
    this.y = y;
    this.life;
    this.color = "blue";
  }

  colors() {
    if (this.life == 3) {
      this.color = "green";
    } else if (this.life == 2) {
      this.color = "blue";
    } else if (this.life == 1) {
      this.color = "red";
    }
  }
}
document.addEventListener("keydown", direction);

function direction(event) {
  if (event.code == "KeyA" || event.code == "KeyD") stepPlatform = 10;
  if (event.code == "KeyA") dir = "left";
  else if (event.code == "KeyD") dir = "right";
  document.addEventListener("keyup", (e) => {
    if (e.code == "KeyA" || e.code == "KeyD") stepPlatform = 0;
  });
}

function startGame() {
  ball.x = w / 2;
  ball.y = h / 2;
  bricks = [];
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 16; x++) {
      bricks.push(new BricksClass(30 + x * brickW, 30 + y * brickH));
    }
  }
  bricks.forEach((elem) => {
    elem.life = elem.color == "blue" ? 2 : 1;
    if (
      elem.y > 30 + 7 * brickH ||
      elem.x == 30 ||
      elem.x == 30 + 15 * brickW
    ) {
      elem.life = 1;
      elem.colors();
    }
    for (let y = 0; y < 4; y++) {
      for (let x = y; x < 16 - y; x++) {
        if (elem.x == 30 + x * brickW && elem.y == 30 + y * brickH) {
          elem.life = 3;
          elem.colors();
        }
      }
    }
    if (elem.color == "blue") elem.y += 30;
    if (elem.color == "red") elem.y += 30;
  });
}

function drawRect(color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.fill();
  ctx.stroke();
}

function eventPlatform() {
  if (dir == "right") {
    if (platform.x < w - platform.width) {
      platform.x += stepPlatform;
    } else {
      platform.x = w - platform.width;
    }
  } else if (dir == "left") {
    if (platform.x > stepPlatform) {
      platform.x -= stepPlatform;
    } else {
      platform.x = 0;
    }
  }
}

function drawCircle(x, y) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x, y, ball.size, 0, 2 * Math.PI);
  ctx.fill();
}

function draw() {
  drawRect("#fff", 0, 0, w, h);
  drawCircle(ball.x, ball.y);
  bricks.forEach((brick) => {
    if (brick.life != 0) {
      drawRect(brick.color, brick.x, brick.y, brick.width, brick.height);
    }
  });
  drawRect("green", platform.x, platform.y, platform.width, platform.height);
}
function collides(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.size > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.size > obj2.y
  );
}

function checkBall() {
  if (ball.x - ball.size + ball.dx < 0 || ball.x + ball.size + ball.dx > w)
    ball.dx = -ball.dx;
  if (ball.y - ball.size + ball.dy < 0) ball.dy = -ball.dy;
  if (ball.y - ball.size > platform.y) return false;
  else if (
    ball.y + ball.size > platform.y &&
    ball.y + ball.size < platform.y + 5 &&
    ball.x + ball.size > platform.x &&
    ball.x < platform.x + platform.width
  )
    ball.dy = -ball.dy;

  ball.x += ball.dx;
  ball.y += ball.dy;

  bricks.forEach((br) => {
    if (br.life != 0) {
      if (collides(ball, br)) {
        if (
          (ball.y + ball.size - Math.abs(ball.dy) <= br.y ||
          ball.y >= br.y + br.height - Math.abs(ball.dy))&&(br.x < ball.x + ball.size-5 && br.x + brickW > ball.x)
        ) {
          ball.dy =-ball.dy;
        }
        else{
          ball.dx *= -1;
        }
        br.life -= 1;
        br.colors();
      }
    }
  });
  return true;
}

function game() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let winCheck = 2;
  bricks.forEach((elem) => {
    winCheck += elem.life;
  });
  if (winCheck == 1) {
    alert("win");
  }
  eventPlatform();
  if (!checkBall()) {
    alert("lose!");
    startGame();
  }
  draw();
}

startGame();
setInterval(game, 20);
