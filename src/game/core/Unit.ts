/**
 * Unit entity for combat
 */
export interface Unit {
  id: string;
  hp: number;
  maxHp: number;
  attack: number;
  x: number;
  y: number;
}

/**
 * Unit stats used for creating new units
 */
export interface UnitStats {
  id: string;
  maxHp: number;
  attack: number;
}

/**
 * Create a new unit from stats at a given position
 */
export function createUnit(stats: UnitStats, x: number, y: number): Unit {
  return {
    id: stats.id,
    hp: stats.maxHp,
    maxHp: stats.maxHp,
    attack: stats.attack,
    x,
    y,
  };
}

/**
 * Check if unit is alive
 */
export function isAlive(unit: Unit): boolean {
  return unit.hp > 0;
}

/**
 * Apply damage to a unit (returns new unit, pure function)
 */
export function takeDamage(unit: Unit, damage: number): Unit {
  return {
    ...unit,
    hp: Math.max(0, unit.hp - damage),
  };
}