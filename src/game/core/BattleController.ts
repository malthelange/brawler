import { Unit, takeDamage, isAlive } from '@/game/core/Unit';

/**
 * Represents a single turn in combat
 */
export interface BattleTurn {
  turnNumber: number;
  attacker: Unit;
  defender: Unit;
  damage: number;
  defenderHpAfter: number;
}

/**
 * Complete battle results
 */
export interface BattleResult {
  turns: BattleTurn[];
  winner: Unit;
  loser: Unit;
}

/**
 * BattleController - Pure combat logic
 * Evaluates entire battle and returns all data needed for rendering
 */
export class BattleController {
  /**
   * Evaluate a complete battle between two units
   * Returns all turn data for the presenter to render
   */
  public static evaluate(unit1: Unit, unit2: Unit): BattleResult {
    const turns: BattleTurn[] = [];
    let currentUnit1 = { ...unit1 };
    let currentUnit2 = { ...unit2 };
    let turnNumber = 1;
    let currentAttacker: 1 | 2 = 1; // unit1 attacks first

    // Simulate battle until one unit dies
    while (isAlive(currentUnit1) && isAlive(currentUnit2)) {
      const attacker = currentAttacker === 1 ? currentUnit1 : currentUnit2;
      const defender = currentAttacker === 1 ? currentUnit2 : currentUnit1;

      // Calculate damage (direct attack value)
      const damage = attacker.attack;

      // Apply damage
      const damagedDefender = takeDamage(defender, damage);

      // Record turn
      turns.push({
        turnNumber,
        attacker: { ...attacker },
        defender: { ...damagedDefender },
        damage,
        defenderHpAfter: damagedDefender.hp,
      });

      // Update defender state
      if (currentAttacker === 1) {
        currentUnit2 = damagedDefender;
      } else {
        currentUnit1 = damagedDefender;
      }

      // Switch turns
      currentAttacker = currentAttacker === 1 ? 2 : 1;
      turnNumber++;
    }

    // Determine winner and loser
    const winner = isAlive(currentUnit1) ? currentUnit1 : currentUnit2;
    const loser = isAlive(currentUnit1) ? currentUnit2 : currentUnit1;

    return {
      turns,
      winner,
      loser,
    };
  }
}