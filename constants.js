// 보드는 10개의 열과 20개의 행으로 구성되어 있음
// 이 값들은 보드를 순환하는데 자주 재사용하므로 블록 크기와 함께 `constants.js` 파일에 상수 값으로 추가함
const COLS = 10; // 열
const ROWS = 20; // 행
const BLOCK_SIZE = 30;
const LINES_PER_LEVEL = 10;
const NO_OF_HIGH_SCORES = 10;
const COLORS = [
  "none",
  "cyan",
  "blue",
  "orange",
  "yellow",
  "green",
  "purple",
  "red",
];

const SHAPES = [
  [],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  [
    [0, 0, 3], // 0,0 -> 2,0 ; 0,1 -> 1,0 ; 0,2 -> 0,0
    [3, 3, 3], // 1,0 -> 2,1 ; 1,1 -> 1,1 ; 1,2 -> 0,1
    [0, 0, 0],
  ], // 2,0 -> 2,2 ; 2,1 -> 1,2 ; 2,2 -> 0,2
  [
    [4, 4],
    [4, 4],
  ],
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
];

// key code mapping
// 열거형을 사용하는 것이 좋으나, JS에는 내장된 열거형이 없으므로 객체를 만들어서 사용함
const KEY = {
  ESC: "Escape",
  SPACE: " ",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  UP: "ArrowUp",
  P: "p",
};

const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
};

const LEVEL = {
  0: 800,
  2: 550,
  3: 300,
  4: 100,
  5: 80,
  6: 70,
  7: 50,
  8: 40,
  9: 30,
  10: 20,
  // 29+ is 20ms
};

// const 키워드는 객체 및 배열을 정의할 떄 오해하기 쉬움
// 실제로 객체나 배열을 불변하게 만들어주지 않으나, Object.freeze()를 사용하면 불변하게 사용할 수 있음
// 위 함수를 사용할 떄 두 가지를 고려해야 함
// 1. require use strict mode
// 2. 불변으로 만드는 값은 1레벨에서만 동작함 다시 말해, 객체 안의 또 다른 객체가 있으면 하위 객체는 불변하게 만들 수 없음
[COLORS, SHAPES, KEY, POINTS, LEVEL].forEach((item) => Object.freeze(item));
