/*base class*/
export class GameElement {
  constructor(name) {
    this.name = name;
    this.position = -1;
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
    this.isActive = false;
  }
}

/*Weapon class inherits from GameElement*/
export class Weapon extends GameElement {
  constructor(name, damage) {
    super(name);
    this.damage = damage;
  }
}