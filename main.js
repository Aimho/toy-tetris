const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

// 상수를 사용해 캔버스의 크기를 계산함
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

// 블록의 크기를 변경함
// scale 함수를 사용하면 매번 `BLOCK_SIZE`로 계산할 필요가 없이 블록의 크기를 1로 취급할 수 있어 코드를 단순화 할 수 있음
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let board = new Board();

// 보드는 테트로미노의 이동 경로를 추적하므로, 게임을 시작하면 테트로미노를 생성하고 그릴 수 있음
const play = () => {
  board.reset();

  let piece = new Piece(ctx);
  piece.draw();

  board.piece = piece;
};

// 현재 생성된 테트로미노를 제거하고 좌표 변경과 함께 복사된 테트로미노를 반환
moves = {
  [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
};

document.addEventListener("keydown", (event) => {
  if (moves[event.key]) {
    // 이벤트 버블링을 막음
    event.preventDefault();

    // 조각의 새 상태를 얻음
    let p = moves[event.key](board.piece);

    // if (board.valid(p)) {
    // 이동이 가능한 상태라면 조각을 이동함
    board.piece.move(p);

    // 그리기 전에 이전 좌표를 지움
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    board.piece.draw();
    // }
  }
});
