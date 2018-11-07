/*The role of board-controller  module is to manage objects on the board */

import { boardSize, rowLen, obstaclesNum, objectsMap, maxMovementSpan } from './settings';
import { GameElement, Player, Weapon } from "./figures";
import * as utils from './utilities';

/*Creates empty board when page is loaded*/
export function initOnLoad() {
  for (let i = 0; i < boardSize; i++) {
    $('#board').append('<div>');
    $('#board div:nth-child(' + (i + 1) + ')').addClass('cell').attr('id', 'cell-' + i);
  }
}

/*Creates weapon, obstacle objects and arranges positions of all objects on the board */
export function initOnStart(player1, player2) {
  $('.cell').html('');
  objectsMap.clear();

  const objectsOnBoard = [player1, player2, new Weapon('pink-cup', 20),
    new Weapon('blue-cup', 30), new Weapon('green-cup', 40)];

  for (let i = 0; i < obstaclesNum; i++) {
    objectsOnBoard.push(new GameElement('wall'));
  }

  for (let el of objectsOnBoard) {
    let index = -1;
    do {
      index = Math.floor(Math.random() * boardSize);
    } while (isCellTaken(index) || !isRightPosition(el, index));

    el.position = index;
    objectsMap.set(index, el);

    const img = utils.addImgToHtmlEl(el.name, 'png');
    $('#cell-' + el.position).append(img);
  }
  player1.weapon.position = player1.position;
  player2.weapon.position = player2.position;
}

/*Re-start the game from clean state */
export function resetAll() {
  utils.removeHighlight();
  $('.cell img:eq(1)').remove();
  $('.in-motion').removeClass('in-motion');
}

/*Takes care that obstacles do not form closed shape, player and weapons are not positioned one next to another */
function isRightPosition(object, position) {
  const virtSiblings = utils.getAdjacentObjects(position);

  //positioning Players and Weapons
  if (!isObstacle(object)) {
    return (virtSiblings.findIndex(el => (!isObstacle(el))) < 0);
  }

  //positioning obstacles
  if (virtSiblings.length > 1) {
    return (virtSiblings.findIndex(el => (utils.isEdgeHorizontal(position) || utils.isEdgeVertical(position)) && utils.isEdge(el.position) && isObstacle(el)) > -1);
  }
  else if (utils.isEdge(position)) {
    return true;
  }
  else if (utils.isEdgeHorizontal(position)) {
    return (virtSiblings.findIndex(el => (utils.isEdgeHorizontal(el.position))) > -1);
  }
  else if (utils.isEdgeVertical(position)) {
    return (virtSiblings.findIndex(el => (utils.isEdgeHorizontal(el.position))) > -1);
  }
  return true;
}

function isObstacle(object) {
  if (!(object instanceof Weapon) && !(object instanceof Player))
    return true;
}

function isCellTaken(position) {
  return ($('#cell-' + position).children().length > 0);
}

/*Higlights horizontal and vertical cells near the active player */
export function highlightMovement(position) {
  addHighlight(position, -1); //left
  addHighlight(position, (-1) * rowLen);   //up
  addHighlight(position, 1);   //right
  addHighlight(position, rowLen);  //down
}

/*Calculates the cells to be highlighted in given direction */
function addHighlight(position, step) {
  let next = position + step;
  let curr = position;
  let stepsCount = 0;
  while (stepsCount < maxMovementSpan && utils.isAdjacent(curr, next)) {
    if (isCellTaken(next) && !(objectsMap.get(next) instanceof Weapon))
      break;
    stepsCount++;
    $('#cell-' + next).addClass('highlight');
    $('.highlight').css('opacity', 0.75);
    curr = next;
    next += step;
  }
}

/*Moves player on the board, fire an event if player passes over the weapon cell*/
export function movePlayer(player, newPos) {
  const oldPos = player.position;
  const oldEl = objectsMap.get(oldPos)
  if (oldEl instanceof Array) {
    const i = oldEl.findIndex(el => el instanceof Weapon);
    const weapon = oldEl[i];
    objectsMap.set(oldPos, weapon);
  }
  else {
    objectsMap.delete(oldPos);
  }

  //fire an event if there are weapons on its path
  //find positions
  const diff = newPos - oldPos;
  let step = Math.abs(diff / rowLen) < 1 ? 1 : rowLen;
  const stepNum = Math.abs(diff) / step;
  step = (diff > 0) ? step : (-1) * step;

  for (let i = 0; i < stepNum; i++) {
    const wPos = oldPos + (i + 1) * step;
    if (isCellTaken(wPos)) {
      const event = jQuery.Event('weapons');
      event.weapon = objectsMap.get(wPos);
      event.player = player;
      event.newPos = newPos;
      $('#board').trigger(event);
    }
  }
  $('.highlight').removeAttr('style');
  $('.highlight').removeClass('highlight');

  const $currCell = $('#cell-' + oldPos);
  const $currCellImg = $('#cell-' + oldPos + ' > img');
  $currCellImg.each(function () {
    if ($(this).css('display') == 'none') {
      $(this).show();
      objectsMap.set(newPos, player);
    } else {
      $(this).remove();
    }
  });

  const imgDOM = utils.addImgToHtmlEl(player.name, 'png');
  $('#cell-' + newPos).append(imgDOM);
  const currEl = objectsMap.get(newPos);
  if (currEl instanceof Weapon) {
    const tempSiblings = [currEl];
    tempSiblings.push(player);
    objectsMap.set(newPos, tempSiblings);
  }
  else {
    objectsMap.set(newPos, player);
  }
}

/*Replaces player's weapon on the board */
export function replaceWeaponOnBoard(player, newPos, weaponOnBoard) {
  const $weapon = $('#cell-' + weaponOnBoard.position + ' > img');
  const $weaponCell = $weapon.parent();
  $weapon.remove();
  const newDOMImg = utils.addImgToHtmlEl(player.weapon.name, 'png');
  $weaponCell.append(newDOMImg);
  if (weaponOnBoard.position == newPos) {
    $('#cell-' + weaponOnBoard.position + ' > img').hide();
  }
  const newWeaponOnBoard = player.weapon;
  newWeaponOnBoard.position = weaponOnBoard.position;
  objectsMap.set(weaponOnBoard.position, newWeaponOnBoard);
}

/*Illustrate the attack */
export function attack(fromPos, toPos) {
  utils.removeHighlight();
  const distance = fromPos - toPos;
  const $playerCell = $('#cell-' + fromPos + ' > img');
  if (distance > 0) {
    $playerCell.addClass('tilt-left');
  }
  else {
    $playerCell.addClass('tilt-right');
  }

}

/*Illustrate the defense */
export function addShield(position) {
  const img = utils.addImgToHtmlEl('plate', 'png');
  $('#cell-' + position).append(img);
  $('#cell-' + position + '>img:last').addClass('shield');
}

export function removeShield(position) {
  $('.shield').remove();
}




