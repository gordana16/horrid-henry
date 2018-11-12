/*base class*/
export class GameElement {
  constructor(name) {
    this.name = name;
    this.position = -1;
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  move(pos) {
    this.position = pos;
  }

  getPosition() {
    return this.position;
  }

}

/*Player class inherits from GameElement*/
export class Player extends GameElement {
  constructor(name, id, health, weapon) {
    super(name);
    this.id = id;
    this.health = health;
    this.weapon = weapon;
    this.force = weapon.damage;
    this.active = false;
  }

  getId() {
    return this.id;
  }
  isActive() {
    return this.active;
  }

  setActiveState(active) {
    this.active = active;
  }
  setHealth(health) {
    this.health = health;
  }

  getHealth() {
    return this.health;
  }

  setWeapon(weapon) {
    this.weapon = weapon;
  }

  getWeapon() {
    return this.weapon;
  }

  setForce(force) {
    this.force = force;
  }

  getForce() {
    return this.force;
  }

}

/*Weapon class inherits from GameElement*/
export class Weapon extends GameElement {
  constructor(name, damage) {
    super(name);
    this.damage = damage;
  }

  getDamage() {
    return this.damage;
  }

  setDamage(damage) {
    this.damage = damage;
  }

}