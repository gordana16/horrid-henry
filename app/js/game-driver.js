/*The role of this module is to controll the whole application. It specifes event handlers and responses to the events*/

import * as boardCtrl from "./board-controller";
import * as playersCtrl from "./players-controller";

/*Creates the empty board when page is loaded*/
boardCtrl.initOnLoad();
/*Creates players, Active player is randomly chosen.*/
playersCtrl.initOnLoad();

/*Starts the game. Players, weapons and obstacles are randomly positioned on the board */
$("#btn-start").on("click", () => {
  playersCtrl.resetAll();
  boardCtrl.resetAll();
  const players = playersCtrl.getPlayers();
  boardCtrl.initOnStart(players);
  /*choose an active player randomly*/
  const index = Math.floor(Math.random() * players.length);
  playersCtrl.setPlayerOn(players[index]);
});

/*Shows the game rules*/
$("#btn-rules").on("click", () => {
  $("#game-rules").css("display", "block");
});

/*Closes the rules and game-over forms*/
$(".btn-close").on("click", () => {
  $("#game-rules").css("display", "none");
  $("#game-over").css("display", "none");
});

/*Higlights the possible movements when player cell is hovered*/
$("#board").on("mouseenter", ".in-motion", () => {
  const activePlayer = playersCtrl.getActivePlayer();
  boardCtrl.highlightMovement(activePlayer.getPosition());
});

/*Move player on the board when one of higlighted cells is clicked*/
$("#board").on("click", ".highlight", function() {
  const newPos = parseInt(
    $(this)
      .attr("id")
      .substr(5)
  );
  const player = playersCtrl.getActivePlayer();
  boardCtrl.movePlayer(player, newPos);
  playersCtrl.updatePlayerPosition(player, newPos);
});

/*Replace player's weapon on the board and panel if player passes over the cell containing weapon*/
$("#board").on("weapons", function(e) {
  boardCtrl.replaceWeaponOnBoard(e.player, e.newPos, e.weapon);
  playersCtrl.replacePlayerWeapon(e.player, e.weapon);
});

/*Active player attacks the opponent player. At the end of his turn, player's health is updated and the players switch their roles*/
$(".btn-attack").on("click", () => {
  const attackingPlayer = playersCtrl.getActivePlayer();
  //find attacked player, his index from Players array
  const attackedPlayerIndex = playersCtrl.getOpponent(
    attackingPlayer.getPosition()
  );
  if (attackedPlayerIndex > -1) {
    const players = playersCtrl.getPlayers();
    const attackedPlayer = players[attackedPlayerIndex];
    boardCtrl.attack(
      attackingPlayer.getPosition(),
      attackedPlayer.getPosition()
    );
    playersCtrl.updatePlayerHealth(attackedPlayer, attackingPlayer.getForce());
    playersCtrl.togglePlayers();
    boardCtrl.removeShield(attackedPlayer.position);
  }
});

/*Attacked player can choose to defend against the next shot*/
$(".btn-defend").on("click", () => {
  const attackingPlayer = playersCtrl.getActivePlayer();
  //find attacked player, his index from Players array
  const attackedPlayerIndex = playersCtrl.getOpponent(
    attackingPlayer.getPosition()
  );
  if (attackedPlayerIndex > -1) {
    const force = attackingPlayer.getForce();
    attackingPlayer.setForce(force / 2);
    const players = playersCtrl.getPlayers();
    const attackedPlayer = players[attackedPlayerIndex];
    boardCtrl.addShield(attackedPlayer.getPosition());
    playersCtrl.hideDefendButton();
  }
});

/*Animation simulates the attack on the board. Remove animation from player on the board when his turn is over */
$("#board").on("animationend", ".tilt-left, .tilt-right", () => {
  boardCtrl.removeTilt();
});
