const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const canvasNext = document.getElementById("next");
const ctxNext = canvasNext.getContext("2d");
const playBtn = document.querySelector("#play-btn");
const pauseBtn = document.querySelector("#pause-btn");

const accountValues = {
  score: 0,
  level: 0,
  lines: 0,
};

const updateAccount = (key, value) => {
  const element = document.getElementById(key);
  if (!element) return null;
  element.textContent = value;
};

// account 객체의 변경사항을 처리하려면, Proxy 객체를 생성하고 set 메서드로 화면을 업데이트하는 코드를 실행할 수 있음
// `accountValues` 객체는 커스텀 동작을 가질 수 있기 때문에 이 객체를 Proxy에 전달함
const account = new Proxy(accountValues, {
  set: (target, key, value) => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  },
});

let requestId = null;
let time = null;

// 현재 생성된 테트로미노를 제거하고 좌표 변경과 함께 복사된 테트로미노를 반환
moves = {
  [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
  [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 }),
  [KEY.UP]: (p) => board.rotate(p),
};

const board = new Board(ctx, ctxNext);

const initNext = () => {
  // Calculate size of canvas from constants
  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 4 * BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
};

const addEventListener = () => {
  document.removeEventListener("keydown", handleKeyPress);
  document.addEventListener("keydown", handleKeyPress);
};

const handleKeyPress = (event) => {
  // 이벤트 버블링을 막음
  event.preventDefault();

  if (event.key === KEY.P) pause();
  if (event.key === KEY.ESC) gameOver();
  if (moves[event.key]) {
    // Get new state
    let p = moves[event.key](board.piece);
    if (!board.valid(p)) return;
    if (event.key === " ") {
      // Hard drop
      while (board.valid(p)) {
        account.score += POINTS.HARD_DROP;
        board.piece.move(p);
        p = moves[KEY.SPACE](board.piece);
      }

      board.piece.hardDrop();
    } else {
      board.piece.move(p);
      if (event.key === KEY.DOWN && pauseBtn.style.display === "block") {
        account.score += POINTS.SOFT_DROP;
      }
    }
  }
};

const resetGame = () => {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  board.reset();
  time = { start: performance.now(), elapsed: 0, level: LEVEL[account.level] };
};

// 보드는 테트로미노의 이동 경로를 추적하므로, 게임을 시작하면 테트로미노를 생성하고 그릴 수 있음
const play = () => {
  addEventListener();

  if (playBtn.style.display === "") resetGame();
  // If we have an old game running then cancel it
  if (requestId) cancelAnimationFrame(requestId);

  animate();
  playBtn.style.display = "none";
  pauseBtn.style.display = "block";
};

// 게임의 실행을 유지하는 core 함수를 반복 실행하는 game loop를 만듦
const animate = (now = 0) => {
  // 지난 시간을 업데이트
  time.elapsed = now - time.start;

  // 지난 시간이 현재 레발의 시간을 초과했는지 확인함
  if (time.elapsed > time.level) {
    // 현재 시간을 다시 측정함
    time.start = now;

    // board.drop이 false면 게임 종료
    if (!board.drop()) {
      gameOver();
      return;
    }
  }

  // 새로운 상태로 그리기 전에 보드를 지움
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.draw();
  // requestAnimationFrame
  // 브라우저에서 animation이 필요할 때, 호출하며 다음 repaint 전에 animation을 업데이트하기 위해 호출함
  // 만약 class 안에서 이 함수를 호출한다면, bind 함수를 이용해 `this`의 컨텍스트를 고정시켜야 함(그렇지 않으면 함수 컨텍스트로써 window 객체를 가짐)
  requestId = requestAnimationFrame(animate);
};

const gameOver = () => {
  cancelAnimationFrame(requestId);

  ctx.fillStyle = "black";
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = "1px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER", 1.8, 4);

  checkHighScore(account.score);
  pauseBtn.style.display = "none";
  playBtn.style.display = "block";
};

const pause = () => {
  if (!requestId) {
    playBtn.style.display = "none";
    pauseBtn.style.display = "block";
    animate();
    return;
  }

  cancelAnimationFrame(requestId);
  requestId = null;

  ctx.fillStyle = "black";
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = "1px Arial";
  ctx.fillStyle = "yellow";
  ctx.fillText("PAUSED", 3, 4);
  playBtn.style.display = "block";
  pauseBtn.style.display = "none";
};

const showHighScores = () => {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  const highScoreList = document.getElementById("highScores");

  highScoreList.innerHTML = highScores
    .map((score) => `<li>${score.score} - ${score.name}</li>`)
    .join("");
};

const checkHighScore = (score) => {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

  if (score <= lowestScore) return;

  const name = prompt("You got a high score! Enter name:");
  const newScore = { score, name };
  saveHighScore(newScore, highScores);
  showHighScores();
};

const saveHighScore = (score, highScores) => {
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);

  localStorage.setItem("highScores", JSON.stringify(highScores));
};

initNext();
showHighScores();
