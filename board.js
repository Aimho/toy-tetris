// 테트리스 보드는 셀들로 구성되어 있고, 각 셀은 채워져 있거나 그렇지 않을 수 있음
// 가장 단순한 방법은 불리언 값으로 셀을 나타내는 것

class Board {
  grid;

  // 새 게임이 시작되면 보드를 초기화 함
  reset() {
    this.grid = this.getEmptyBoard();
  }

  // 0으로 채워진 행렬을 얻음
  getEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }
}
