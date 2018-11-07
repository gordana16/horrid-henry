const boardSize = 100;
const columnLen = Math.sqrt(boardSize);
const rowLen = columnLen;
const obstaclesNum = 20;

const objectsMap = new Map();

const maxMovementSpan = 3;

export { boardSize, columnLen, rowLen, obstaclesNum, objectsMap, maxMovementSpan };