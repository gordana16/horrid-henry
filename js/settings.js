const boardSize = 100;
const columnLen = Math.sqrt(boardSize);
const rowLen = columnLen;
const obstaclesNum = 20;
const maxMovementSpan = 3;


const weaponsConfig = [
  { name: 'pink-cup', damage: 20 },
  { name: 'blue-cup', damage: 30 },
  { name: 'green-cup', damage: 40 }
];

const playersConfig = [
  { name: 'Henry', id: 1, health: 100, weapon: { name: 'yellow-cup', damage: 10 } },
  { name: 'Maggie', id: 2, health: 100, weapon: { name: 'yellow-cup', damage: 10 } }
];


export { boardSize, columnLen, rowLen, obstaclesNum, maxMovementSpan, playersConfig, weaponsConfig };