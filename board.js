// 테트리스 보드는 셀들로 구성되어 있고, 각 셀은 채워져 있거나 그렇지 않을 수 있음
// 가장 단순한 방법은 불리언 값으로 셀을 나타내는 것

class Board {
  constructor(ctx, ctxNext) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.init();
  }

  init() {
    // 상수를 사용해 캔버스의 크기를 계산함
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

    // 블록의 크기를 변경함
    // scale 함수를 사용하면 매번 `BLOCK_SIZE`로 계산할 필요가 없이 블록의 크기를 1로 취급할 수 있어 코드를 단순화 할 수 있음
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  // 0으로 채워진 행렬을 얻음
  getEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  getNewPiece() {
    const { width, height } = this.ctxNext.canvas;
    this.next = new Piece(this.ctxNext);
    this.ctxNext.clearRect(0, 0, width, height);
    this.next.draw();
  }

  // 새 게임이 시작되면 보드를 초기화 함
  reset() {
    this.grid = this.getEmptyBoard();
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
    this.getNewPiece();
  }

  // board를 그리는 함수
  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  draw() {
    this.piece.draw();
    this.drawBoard();
  }

  // Tetromino를 더 이상 아래로 움직일 수 없는 경우, 조각을 고정함
  // board에 tetromino 블록을 병합시킴(console.table로 확인 가능함)
  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
    console.table(board.grid);
  }

  // 줄 지우기
  clearLines() {
    let lines = 0;

    this.grid.forEach((row, y) => {
      // 모든 값이 0보다 큰지 비교함
      if (row.every((value) => value > 0)) {
        lines++;

        // 행을 삭제함
        this.grid.splice(y, 1);

        // 맨 위에 0으로 채워진 행을 추가함
        this.grid.unshift(Array(COLS).fill(0));
      }
    });

    if (lines > 0) {
      // 지워진 줄과 레벨로 점수를 계산함
      if (account.lines >= LINES_PER_LEVEL) {
        // 레벨 값 증가
        account.level++;

        // 다음 레벨을 시작하기 위해 줄을 지움
        account.lines -= LINES_PER_LEVEL;

        // 게임 속도를 올림
        time.level = LEVEL[account.level];
      }
    }
  }

  drop() {
    const p = moves[KEY.DOWN](this.piece);
    if (this.valid(p)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines();

      // 남아있는 행이 0 이면, loop 종료
      if (this.piece.y === 0) return false;
      this.piece = this.next;
      this.piece.ctx = this.ctx;
      this.piece.setStartingPosition();
      this.getNewPiece();
    }
    return true;
  }

  isEmpty(value) {
    return value === 0;
  }

  // board 충돌 감지
  insideWalls(x, y) {
    return x >= 0 && x < COLS && y < ROWS;
  }

  // board 안의 tetromino 충돌 감지
  notOccupied(x, y) {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  // 테트로미노를 움직이기 전에 이동한 위치가 유효한지 확인하는 로직
  valid(p) {
    // every() 메서드를 사용하면 배열의 모든 요소가 충돌 조건을 통과했는지 여부를 확인할 수 있음
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        const x = p.x + dx;
        const y = p.y + dy;
        return (
          this.isEmpty(value) ||
          (this.insideWalls(x, y) && this.notOccupied(x, y))
        );
      });
    });
  }

  // 선형 대수(linear algebra)를 이용하면 회전시키는 방법을 쉽게 처리할 수 있음
  // 두 개의 반사 행렬은 45도에서 90도로 회전을 가능하게 하므로 행렬을 변환할 수 있음, 그럼 다음 열의 순서를 바꾸는 치환 행렬을 곱함
  rotate(piece) {
    // Clone with JSON for immutability
    const p = JSON.parse(JSON.stringify(piece));

    if (!piece.hardDropped) {
      // 행렬을 변환함. p는 Piece의 Instance
      for (let y = 0; y < p.shape.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
        }
      }
    }

    // 열 순서대로 뒤집음
    p.shape.forEach((row) => row.reverse());
    return p;
  }

  getLinesClearedPoints(lines) {
    const lineClearPoints = () => {
      if (lines === 1) return POINTS.SINGLE;
      if (lines === 2) return POINTS.DOUBLE;
      if (lines === 3) return POINTS.TRIPLE;
      if (lines === 4) return POINTS.TETRIS;
      return 0;
    };

    return (account.level + 1) * lineClearPoints();
  }
}
