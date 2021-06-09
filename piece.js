// 테트리스의 한 조각은 조합된 4개의 블록으로 구성되어 있는데, 이 조각을 테트로미노(tetromino)라고 부르며, 7가지 패턴과 색상이 있음
// 보드에서 테트로미노의 위치, 색상, 모양을 알기 위해서 Piece 클래스가 필요함
// 보드에 각 테트로미노를 그릴 수 있도록 캔버스 컨텍스트를 참조해야 함
class Piece {
  x;
  y;
  color;
  shape;
  ctx;

  constructor(ctx) {
    this.ctx = ctx;
    this.spawn();
  }

  spawn() {
    this.color = "blue";
    this.shape = [
      [2, 0, 0],
      [2, 2, 2],
      [0, 0, 0],
    ];

    // Starting position
    this.x = 3;
    this.y = 0;
  }

  move(p) {
    this.x = p.x;
    this.y = p.y;
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
}
