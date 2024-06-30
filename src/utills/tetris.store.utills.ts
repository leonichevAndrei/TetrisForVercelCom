import { gameStateEnum, generateFieldTypes } from '@/config/tetris.enums';
import allElements from '@/assets/elements/all-elms';

export function getMiddlePosition(width: number, elementWidth: number) {
  return Math.round(width / 2 - elementWidth / 2 - 0.1) + 1;
}
export function generateAnyFieldMatrix(
  width: number,
  height: number,
  generateFieldType: generateFieldTypes
) {
  const matrix: number[][] = [];
  let result: number = 0;
  for (let y = 0; y < height; y++) {
    matrix[y] = [];
    for (let x = 0; x < width; x++) {
      switch (generateFieldTypes[generateFieldType]) {
        case 'filled':
          result = 1;
          break;
        case 'empty':
          result = 0;
          break;
        case 'random':
          result = Math.round(Math.random());
      }
      matrix[y][x] = result;
    }
  }
  return matrix;
}
export function getPresetMatrix() {
  return [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
}
export function renderFieldMatrix(
  staticMatrix: number[][],
  fieldMatrix: number[][],
  elementId: number,
  prevElementCoords: number[],
  elementCoords: number[],
  elementSpin: number
): {
  matrix: number[][];
  gameState: gameStateEnum;
  returnPrevCoords: boolean;
  returnPrevSpin: boolean;
  isGameOver?: boolean;
} {
  const element = allElements[elementId][elementSpin];
  let isPossiblePosition = true;
  let isPossibleRotation = true;
  let isCollision = false;
  let isGameOver = false;
  const newFieldMatrix = JSON.parse(JSON.stringify(staticMatrix));
  let relX: number, relY: number;

  // Cycle to check each point of the element and the corresponding field part:
  for (let y = 0; y < element.length; y++) {
    for (let x = 0; x < element[y].length; x++) {
      // Get the relative coordinates of the corresponding field part:
      relX = x + elementCoords[0];
      relY = y + elementCoords[1];
      // If the current checking coordinates are inside our field:
      if (
        staticMatrix[relY] != undefined &&
        staticMatrix[relY][relX] != undefined
      ) {
        // Add the corresponding element point information to the field if this point exists:
        newFieldMatrix[relY][relX] =
          element[y][x] == 1 ? element[y][x] : staticMatrix[relY][relX];
        // If the field point and element point are at the same positions:
        if (staticMatrix[relY][relX] == 1 && element[y][x] == 1) {
          // Element is newly spawned:
          if (
            elementCoords[1] === prevElementCoords[1] &&
            elementCoords[1] === 0
          ) {
            isGameOver = true;
            // If the element is after rotation:
          } else if (
            elementCoords[0] === prevElementCoords[0] &&
            elementCoords[1] === prevElementCoords[1]
          ) {
            isPossibleRotation = false;
            // If the element came from the top (falling down), set the event as a collision:
          } else if (elementCoords[1] > prevElementCoords[1]) {
            isCollision = true;
            // In other cases (element came from the left or right), it's not a possible position:
          } else {
            isPossiblePosition = false;
          }
          break;
        }
        // If the current checking coordinates are outside of the field:
      } else {
        // If the element is after rotation:
        if (
          elementCoords[0] == prevElementCoords[0] &&
          elementCoords[1] == prevElementCoords[1]
        ) {
          isPossibleRotation = false;
          // If these coordinates are below the bottom part of the field (along the y-axis) and the element came from the top (falling), set the event as a collision:
        } else if (
          element[y][x] == 1 &&
          staticMatrix[relY] == undefined &&
          elementCoords[1] > prevElementCoords[1]
        ) {
          isCollision = true;
          break;
          // Otherwise, if the element came from the left or right and the current point of the element exists, mark it as an impossible position (and return the coordinates to the previous step along the x-axis):
        } else if (
          element[y][x] == 1 &&
          (elementCoords[1] == prevElementCoords[1] ||
            elementCoords[1] < prevElementCoords[1])
        ) {
          isPossiblePosition = false;
          break;
        }
      }
    }
    if (isCollision || !isPossiblePosition || !isPossibleRotation || isGameOver)
      break;
  }

  if (isGameOver) {
    // console.log('* GAME OVER');
    return {
      matrix: newFieldMatrix,
      gameState: gameStateEnum.nothing,
      returnPrevCoords: false,
      returnPrevSpin: false,
      isGameOver,
    };
  } else if (!isPossiblePosition) {
    // console.log('* NOT POSSIBLE POSITION');
    return {
      matrix: fieldMatrix,
      gameState: gameStateEnum.movement,
      returnPrevCoords: true,
      returnPrevSpin: false,
    };
  } else if (!isPossibleRotation) {
    // console.log('* NOT POSSIBLE ROTATION');
    return {
      matrix: fieldMatrix,
      gameState: gameStateEnum.movement,
      returnPrevCoords: true,
      returnPrevSpin: true,
    };
  } else if (isCollision) {
    // console.log('* IS COLLISION');
    return {
      matrix: fieldMatrix,
      gameState: gameStateEnum.collision,
      returnPrevCoords: false,
      returnPrevSpin: false,
    };
  } else {
    // console.log('* CONTINUE MOVEMENT');
    return {
      matrix: newFieldMatrix,
      gameState: gameStateEnum.movement,
      returnPrevCoords: false,
      returnPrevSpin: false,
    };
  }
}
export function getCleaningStateByStaticMatrix(staticMatrix: number[][]) {
  const resultObj = { byXAxis: new Array(), byYAxis: new Array() };
  for (let y = 0; y < staticMatrix.length; y++) {
    let isFilledLine = true;
    for (let x = 0; x < staticMatrix[y].length; x++) {
      if (staticMatrix[y][x] == 0) {
        isFilledLine = false;
        break;
      }
    }
    if (isFilledLine) {
      resultObj.byYAxis.push(y);
      if (resultObj.byXAxis.length == 0) {
        resultObj.byXAxis.push(
          ...Array.from({ length: staticMatrix[0].length }, (_, k) => k)
        );
      }
    }
  }
  return resultObj;
}
export function renderCleanedFieldMatrix(
  staticMatrix: number[][],
  cleaningState: { byXAxis: number[]; byYAxis: number[] }
) {
  const nextStaticMatrix = JSON.parse(JSON.stringify(staticMatrix));
  const nextCleaningState = JSON.parse(JSON.stringify(cleaningState));
  for (let y = 0; y < cleaningState.byYAxis.length; y++) {
    if (cleaningState.byXAxis[0] !== undefined) {
      nextStaticMatrix[cleaningState.byYAxis[y]][cleaningState.byXAxis[0]] = 0;
    }
  }
  nextCleaningState.byXAxis = cleaningState.byXAxis.slice(1);
  return { nextStaticMatrix, nextCleaningState };
}
export function combineStaticMatrixPartsInOne(data: {
  staticMatrix: number[][];
  lines: number[];
}) {
  const lines = data.lines;
  const matrix = data.staticMatrix;
  const length = data.staticMatrix[0].length;
  const addedPart = new Array(lines.length).fill(new Array(length).fill(0));
  matrix.splice(lines[0], lines.length);
  matrix.unshift(...addedPart);
  return matrix;
}
export function calculateSizePixels(size: number) {
  const ceilSize = 16;
  const ceilMargin = 3;
  const fieldPadding = 3;
  const fieldBorder = 1;
  return (ceilSize + ceilMargin * 2) * size + (fieldPadding + fieldBorder) * 2;
}
export function addToLeaderboard(
  oldData: { name: string; points: number }[],
  name: string,
  points: number
) {
  const newData = JSON.parse(JSON.stringify(oldData));
  for (const [index, record] of newData.entries()) {
    if (record.points < points) {
      newData.splice(index, 0, { name, points });
      newData.pop();
      break;
    }
  }
  return { data: newData };
}
