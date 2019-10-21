/*a bunch of helper functions*/

import { rowLen, columnLen } from "./settings";

export function isFirstRow(pos) {
  return Math.floor(pos / rowLen) === 0;
}

export function isLastRow(pos) {
  return Math.floor(pos / rowLen) === rowLen - 1;
}

export function isFirstColumn(pos) {
  return pos % columnLen === 0;
}

export function isLastColumn(pos) {
  return pos % columnLen === columnLen - 1;
}

export function isEdgeHorizontal(pos) {
  return isFirstRow(pos) || isLastRow(pos);
}

export function isEdgeVertical(pos) {
  return isFirstColumn(pos) || isLastColumn(pos);
}

export function isEdge(pos) {
  return isEdgeHorizontal(pos) && isEdgeVertical(pos);
}

export function isAdjacent(pos1, pos2) {
  const adjMap = getAdjacentIndexes(pos1);
  for (let [key, value] of adjMap) {
    if (value === pos2) return true;
  }
  return false;
}

/*return the positions that are next to one another on the board, ignore edge positions*/
export function getAdjacentIndexes(pos) {
  const left = pos % rowLen > 0 ? pos - 1 : -1;
  const right = pos % rowLen < rowLen - 1 ? pos + 1 : -1;
  const up = pos / rowLen > 0 ? pos - rowLen : -1;
  const down = pos / rowLen < rowLen - 1 ? pos + rowLen : -1;

  const leftUp = left > -1 && up > -1 ? up - 1 : -1;
  const leftDown = left > -1 && down > -1 ? down - 1 : -1;
  const rightUp = right > -1 && up > -1 ? up + 1 : -1;
  const rightDown = right > -1 && down > -1 ? down + 1 : -1;

  const adjMap = new Map();
  adjMap.set("left", left);
  adjMap.set("leftUp", leftUp);
  adjMap.set("up", up);
  adjMap.set("rightUp", rightUp);
  adjMap.set("right", right);
  adjMap.set("rightDown", rightDown);
  adjMap.set("down", down);
  adjMap.set("leftDown", leftDown);

  return adjMap;
}

export function addImgToHtmlEl(name, type) {
  const imgEl = "<img src=img/" + name + "." + type + ">";
  return imgEl;
}
