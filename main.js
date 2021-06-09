const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

// 상수를 사용해 캔버스의 크기를 계산함
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

// 블록의 크기를 변경함
// scale 함수를 사용하면 매번 `BLOCK_SIZE`로 계산할 필요가 없이 블록의 크기를 1로 취급할 수 있어 코드를 단순화 할 수 있음
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
