/*The role of players-controller  module is to manage data displayed on the player's panel*/

import { GameElement, Player, Weapon } from "./figures";
import { columnLen } from "./settings";
import { isAdjacent, addImgToHtmlEl } from "./utilities";

let player1, player2;

/*Create player objects and their default weapon object*/
export function createPlayers() {
  player1 = new Player('Henry', 1, 100, new Weapon('yellow-cup', 10));
  player2 = new Player('Maggie', 2, 100, new Weapon('yellow-cup', 10));

  setHealthDOM(player1);
  setWeaponDamageDOM(player1);

  setHealthDOM(player2);
  setWeaponDamageDOM(player2);
  return [player1, player2];
}

/*Re-start the game from clean state */
export function resetAll() {
  //bring buttons to initial state
  hideButtons();
  enableButtons();
  $('.active-panel').removeClass('active-panel');
  $('.force > img[alt != "yellow-cup"]').remove('img');
  const newDOMImg = addImgToHtmlEl('yellow-cup', 'png');
  $('.force:not(:has(img))').prepend(newDOMImg);
}

/*Displays player's health on the panel */
function setHealthDOM(player) {
  if (player.health <= 0) {
    player.health = 0;
  }
  $('#health-' + player.id).html(player.health);
}

/*Displays weapon's force on the panel */
function setWeaponDamageDOM(player) {
  $('#damage-' + player.id).html(player.weapon.damage);
}

/*When player is on, he can move and attack*/
export function setPlayerOn(player) {
  player.isActive = true;
  $('#player-' + player.id).addClass('active-panel');
  if (isClash(player)) {
    showAttackButton(player)
  }
  else {
    $('#cell-' + player.position).addClass('in-motion');
  }
}

/*When player is off, he can't move arround and attack, he can be attacked and defend himself*/
function setPlayerOff(player) {
  player.isActive = false;
  $('.active-panel').removeClass('active-panel');
  if (isClash(player)) {
    showDefendButton(player);
    player.force = player.weapon.damage;
  }
}

/*Switches the player state: on to off and off to on*/
export function togglePlayers() {
  const playerOn = (player1.isActive) ? player1 : player2;
  const playerOff = getOpponent(playerOn);
  setPlayerOff(playerOn);
  setPlayerOn(playerOff);
}

/*Returns both players*/
export function getPlayers() {
  return (player1.isActive) ? [player1, player2] : [player2, player1];
}

/*Return player which is currently on*/
export function getActivePlayer() {
  return (player1.isActive) ? player1 : player2;
}

/*Updates player position after moving. If players are next to one another, the battle begins and Attack/Defend buttons have to be displayed*/
export function updatePlayerPosition(player, pos) {
  $('.in-motion').removeClass('in-motion');

  player.position = pos;
  player.weapon.position = pos;
  if (isClash(player)) {
    showAttackButton(player);
    const opponent = getOpponent(player);
    showDefendButton(opponent);
  }
  else {
    togglePlayers();
  }
}

/*Returns opponent player*/
function getOpponent(player) {
  return (player === player1) ? player2 : player1;
}

/*Returns true if players are next to one another, ignores those players which positions are not in the same row on the board */
function isClash(player) {
  const opponent = getOpponent(player);
  const pos1 = player.position;
  const pos2 = opponent.position;
  const absDistance = Math.abs(pos1 - pos2);
  return (isAdjacent(pos1, pos2) && (absDistance === 1 || absDistance === columnLen));
}

/*Hides the defend button*/
export function hideDefendButton(player) {
  $('#player-' + player.id + ' > .btn-defend').css('display', 'none');
}

/*Shows the attack button*/
function showAttackButton(player) {
  $('#player-' + player.id + ' > .btn-attack').css('display', 'block');
  $('#player-' + player.id + ' > .btn-defend').css('display', 'none');
}

/*Shows the defend button*/
function showDefendButton(player) {
  $('#player-' + player.id + ' > .btn-attack').css('display', 'none');
  $('#player-' + player.id + ' > .btn-defend').css('display', 'block');
}

function hideButtons() {
  $('.btn-attack').css('display', 'none');
  $('.btn-defend').css('display', 'none');
}

function disableButtons() {
  $('.btn-attack').attr('disabled', 'disabled');
  $('.btn-defend').attr('disabled', 'disabled');
}

function enableButtons() {
  $('.btn-attack').removeAttr('disabled');
  $('.btn-defend').removeAttr('disabled');
}

/*Updates player health and checks if game is over */
export function updatePlayerHealth(player, force) {
  player.health -= force;
  setHealthDOM(player);
  if (player.health <= 0) {
    disableButtons();
    const opponent = getOpponent(player);
    $('#winner').html(opponent.name);
    $('#game-over').css('display', 'block');
  }
}

/*Replaces player's weapon on the panel*/
export function replacePlayerWeapon(player, weapon) {

  player.weapon = weapon;
  player.force = weapon.damage;
  let $weaponElement = $('#player-' + player.id + '> .force');
  $weaponElement.children('img').remove();
  let newDOMImg = addImgToHtmlEl(weapon.name, 'png ');
  $weaponElement.prepend(newDOMImg);
  $weaponElement.children('img').attr('alt', weapon.name);
  $weaponElement.children('#damage-' + player.id).html(weapon.damage);
}






