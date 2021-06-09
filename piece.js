// 테트리스의 한 조각은 조합된 4개의 블록으로 구성되어 있는데, 이 조각을 테트로미노(tetromino)라고 부르며, 7가지 패턴과 색상이 있음
// 보드에서 테트로미노의 위치, 색상, 모양을 알기 위해서 Piece 클래스가 필요함
// 보드에 각 테트로미노를 그릴 수 있도록 캔버스 컨텍스트를 참조해야 함
class Piece {
  constructor(ctx) {
    this.ctx = ctx;
    this.spawn();
  }

  spawn() {
    // random한 tetromino 조각을 얻고, 색상과 모양을 적용함
    this.typeId = this.randomizeTetrominoType(COLORS.length - 1);
    this.shape = SHAPES[this.typeId];
    this.color = COLORS[this.typeId];

    this.x = 0;
    this.y = 0;
    this.hardDropped = false;
  }

  // 보드에 테트로미노를 그리기 위해, `shape`의 모든 셀을 순회함
  // 셀 값이 0보다 크다면, 블록을 칠함
  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        // this.x, this.y는 shape의 상단 왼쪽 좌표임
        // shape 안에 있는 블록 좌표에 x, y를 더함
        // 보드에서 블록의 좌표는 this.x + x가 됨
        if (value > 0) {
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }

  move(p) {
    if (!this.hardDropped) {
      this.x = p.x;
      this.y = p.y;
    }
    this.shape = p.shape;
  }

  hardDrop() {
    this.hardDropped = true;
  }

  setStartingPosition() {
    this.x = this.typeId === 4 ? 4 : 3;
  }

  // Tetromino 한 조각을 선택하기 위해 조각들의 Index를 random화
  // random 숫자를 얻기 위해 배열의 길이를 사용한 함수를 생성함
  randomizeTetrominoType(noOfTypes) {
    return Math.floor(Math.random() * noOfTypes + 1);
  }
}
