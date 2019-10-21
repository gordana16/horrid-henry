/*The role of players-controller module is to manage data displayed on the player's panel*/

import { Player, Weapon } from "./figures.js";
import { columnLen, playersConfig } from "./settings";
import { isAdjacent, addImgToHtmlEl } from "./utilities";

/*array of players*/
let players = [];

/*Create the player objects and their default weapon object*/
export function initOnLoad() {
  for (const pConfig of playersConfig) {
    const defaultWeapon = new Weapon(
      pConfig.weapon.name,
      pConfig.weapon.damage
    );
    const player = new Player(
      pConfig.name,
      pConfig.id,
      pConfig.health,
      defaultWeapon
    );
    players.push(player);
  }

  for (const player of players) {
    setHealthDOM(player);
    setWeaponDamageDOM(player);
  }
}

/*Re-start the game from the clean state */
export function resetAll() {
  //bring the buttons to the initial state
  hideButtons();
  enableButtons();
  $(".active-panel").removeClass("active-panel");
  //set player's health to default
  for (const pConfig of playersConfig) {
    const defaultHealth = pConfig.health;
    const player = players.find(pl => pl.getId() === pConfig.id);
    player.setHealth(defaultHealth);
    setHealthDOM(player);
    const weapon = player.getWeapon();
    if (weapon.getName() !== pConfig.weapon.name) {
      //set player's weapon to default
      weapon.setName(pConfig.weapon.name);
      weapon.setDamage(pConfig.weapon.damage);
      setWeaponDamageDOM(player);
      $(".force > img[alt != " + pConfig.weapon.name + "]").remove("img");
      const newDOMImg = addImgToHtmlEl(pConfig.weapon.name, "png");
      $(".force:not(:has(img))").prepend(newDOMImg);
    }
  }
}

/*Displays the player's health on the panel */
function setHealthDOM(player) {
  if (player.getHealth() <= 0) {
    player.setHealth(0);
  }
  $("#health-" + player.getId()).html(player.getHealth());
}

/*Displays the weapon's damage on the panel */
function setWeaponDamageDOM(player) {
  const weapon = player.getWeapon();
  $("#damage-" + player.getId()).html(weapon.getDamage());
}

/*When player is on, he can move and attack*/
export function setPlayerOn(player) {
  player.setActiveState(true);
  $("#player-" + player.getId()).addClass("active-panel");
  if (getOpponent(player.getPosition()) > -1) {
    showAttackButton(player);
  } else {
    $("#cell-" + player.getPosition()).addClass("in-motion");
  }
}

/*When player is off, he can't move arround and attack, he can be attacked and defend himself*/
function setPlayerOff(player) {
  player.setActiveState(false);
  $(".active-panel").removeClass("active-panel");
  if (getOpponent(player.getPosition()) > -1) {
    showDefendButton(player);
    const weapon = player.getWeapon();
    player.setForce(weapon.getDamage());
  }
}

/*Switches the player state: on to off and off to on*/
export function togglePlayers() {
  const playerOn = getActivePlayer();
  //player with next id will be active
  const nextIndex = playerOn.getId() % players.length;
  const playerOff = players[nextIndex];
  setPlayerOff(playerOn);
  setPlayerOn(playerOff);
}

/*Returns players*/
export function getPlayers() {
  return players;
}

/*Return the player which is currently on*/
export function getActivePlayer() {
  const player = players.find(pl => pl.isActive() === true);
  return player;
}

/*Updates the player's position after moving. If the players are next to one another, the battle begins and Attack/Defend buttons have to be displayed*/
export function updatePlayerPosition(player, pos) {
  $(".in-motion").removeClass("in-motion");

  player.move(pos);
  const weapon = player.getWeapon();
  weapon.move(pos);
  const oppIndex = getOpponent(player.getPosition());
  if (oppIndex > -1) {
    showAttackButton(player);
    showDefendButton(players[oppIndex]);
  } else {
    togglePlayers();
  }
}

/*Updates the player's health and checks if game is over */
export function updatePlayerHealth(player, force) {
  const newHealth = player.getHealth() - force;
  player.setHealth(newHealth);
  setHealthDOM(player);
  if (newHealth <= 0) {
    disableButtons();
    const oppIndex = getOpponent(player.position);
    const opponent = players[oppIndex];
    $("#winner").html(opponent.getName());
    $("#game-over").css("display", "block");
  }
}

/*Replaces the player's weapon on the panel*/
export function replacePlayerWeapon(player, weapon) {
  player.setWeapon(weapon);
  const damage = weapon.getDamage();
  player.setForce(damage);
  let $weaponElement = $("#player-" + player.getId() + "> .force");
  $weaponElement.children("img").remove();
  let newDOMImg = addImgToHtmlEl(weapon.getName(), "png ");
  $weaponElement.prepend(newDOMImg);
  $weaponElement.children("img").attr("alt", weapon.getName());
  $weaponElement.children("#damage-" + player.getId()).html(damage);
}

/*Returns the index of opponent player if exists.*/
export function getOpponent(pos) {
  const index = players.findIndex(opp => isClash(pos, opp.getPosition()));
  return index !== undefined ? index : -1;
}

function isClash(pos1, pos2) {
  const absDistance = Math.abs(pos1 - pos2);
  return (
    isAdjacent(pos1, pos2) && (absDistance === 1 || absDistance === columnLen)
  );
}

/*Shows the attack button*/
function showAttackButton(player) {
  $("#player-" + player.getId() + " > .btn-attack").css("display", "block");
  $("#player-" + player.getId() + " > .btn-defend").css("display", "none");
}

/*Shows the defend button*/
function showDefendButton(player) {
  $("#player-" + player.getId() + " > .btn-attack").css("display", "none");
  $("#player-" + player.getId() + " > .btn-defend").css("display", "block");
}

function hideButtons() {
  $(".btn-attack").css("display", "none");
  $(".btn-defend").css("display", "none");
}

function disableButtons() {
  $(".btn-attack").attr("disabled", "disabled");
  $(".btn-defend").attr("disabled", "disabled");
}

function enableButtons() {
  $(".btn-attack").removeAttr("disabled");
  $(".btn-defend").removeAttr("disabled");
}

/*Hides the defend button*/
export function hideDefendButton() {
  $(".btn-defend").css("display", "none");
}

export function removeTilt() {
  $(".tilt-left").removeClass("tilt-left");
  $(".tilt-right").removeClass("tilt-right");
}
