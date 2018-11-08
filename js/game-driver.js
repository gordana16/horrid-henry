/*The role of this module is controll the whole application. It specifes event handlers and responses to the events*/

import * as boardCtrl from './board-controller';
import * as playersCtrl from './players-controller';

/*Creates the empty board when page is loaded*/
boardCtrl.initOnLoad();

/*Starts the game. Active player is randomly chosen. Players, weapons and obstacles are randomly positioned on the board */
$('#btn-start').on('click', () => {
  playersCtrl.resetAll();
  boardCtrl.resetAll();
  const [player1, player2] = playersCtrl.createPlayers();
  boardCtrl.initOnStart(player1, player2);
  const playerOn = Math.random() < 0.5 ? player1 : player2;
  playersCtrl.setPlayerOn(playerOn);

});

/*Shows the game rules*/
$('#btn-rules').on('click', () => {
  $('#game-rules').css('display', 'block');
});

/*Closes the rules and game-over forms*/
$('.btn-close').on('click', () => {
  $('#game-rules').css('display', 'none');
  $('#game-over').css('display', 'none');
});

/*Higlights the possible movements when player cell is hovered*/
$('#board').on('mouseenter', '.in-motion', event => {
  const activePlayer = playersCtrl.getActivePlayer();
  boardCtrl.highlightMovement(activePlayer.position);
});

/*Move player on the board when one of higlighted cells is clicked*/
$('#board').on('click', '.highlight', function () {
  const newPos = parseInt(($(this).attr('id')).substr(5));
  const player = playersCtrl.getActivePlayer(true);
  boardCtrl.movePlayer(player, newPos);
  playersCtrl.updatePlayerPosition(player, newPos);
});

/*Replace player's weapon on the board and panel if player passes over the cell containing weapon*/
$('#board').on('weapons', function (e) {
  boardCtrl.replaceWeaponOnBoard(e.player, e.newPos, e.weapon);
  playersCtrl.replacePlayerWeapon(e.player, e.weapon);
});

/*Active player attacks the opponent player. At the end of his turn, player's health is updated and the players switch their roles*/
$('.btn-attack').on('click', () => {
  const [attackingPlayer, attackedPlayer] = playersCtrl.getPlayers();
  boardCtrl.attack(attackingPlayer.position, attackedPlayer.position);
  playersCtrl.updatePlayerHealth(attackedPlayer, attackingPlayer.force);
  playersCtrl.togglePlayers();
  boardCtrl.removeShield(attackedPlayer.position);
});

/*Attacked player can choose to defend against the next shot*/
$('.btn-defend').on('click', () => {
  const [attackingPlayer, attackedPlayer] = playersCtrl.getPlayers();
  attackingPlayer.force /= 2;
  boardCtrl.addShield(attackedPlayer.position);
  playersCtrl.hideDefendButton(attackedPlayer);
});

/*Animation simulates the attack on the board. Remove animation from player on the board when his turn is over */
$('#board').on('animationend', '.tilt-left, .tilt-right', () => {
  boardCtrl.removeTilt();
});




















