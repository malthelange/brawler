import { Unit, takeDamage } from '@/game/core/Unit';
import { Player, hasLost, updatePlayerBoard } from './Player';
import { BoardPosition } from './BoardPosition';
import { getValidTargets, getAliveUnits, getUnitAtPosition, updateUnit, findUnitPosition } from './Board';

/**
 * Represents a single turn in combat
 */
export interface BattleTurn {
  turnNumber: number;
  attackingPlayerId: string;
  attacker: Unit;
  attackerPosition: BoardPosition;
  defender: Unit;
  defenderPosition: BoardPosition;
  damage: number;
  defenderHpAfter: number;
}

/**
 * Complete battle results
 */
export interface BattleResult {
  turns: BattleTurn[];
  winner: Player;
  loser: Player;
}

/**
 * BattleController - Pure combat logic
 * Evaluates entire battle between two players and returns all data needed for rendering
 */
export class BattleController {
  /**
   * Evaluate a complete battle between two players
   * Returns all turn data for the presenter to render
   */
  public static evaluate(player1: Player, player2: Player): BattleResult {
    const turns: BattleTurn[] = [];
    let currentPlayer1 = structuredClone(player1);
    let currentPlayer2 = structuredClone(player2);
    let turnNumber = 1;
    let currentAttackingPlayer: 1 | 2 = 1; // Player 1 attacks first

    // Simulate battle until one player loses (no alive units)
    while (!hasLost(currentPlayer1) && !hasLost(currentPlayer2)) {
      const attackingPlayer = currentAttackingPlayer === 1 ? currentPlayer1 : currentPlayer2;
      const defendingPlayer = currentAttackingPlayer === 1 ? currentPlayer2 : currentPlayer1;

      // Get first alive unit from attacking player (simple strategy for now)
      const attackers = getAliveUnits(attackingPlayer.board);
      if (attackers.length === 0) break;
      const attacker = attackers[0]!;
      const attackerPosition = findUnitPosition(attackingPlayer.board, attacker.id);
      if (!attackerPosition) break;

      // Get valid targets from defending player
      const validTargetPositions = getValidTargets(defendingPlayer.board);
      if (validTargetPositions.length === 0) break;

      // Select first valid target (simple strategy for now)
      const defenderPosition = validTargetPositions[0]!;
      const defender = getUnitAtPosition(defendingPlayer.board, defenderPosition);
      if (!defender) break;

      // Calculate damage (direct attack value)
      const damage = attacker.attack;

      // Apply damage
      const damagedDefender = takeDamage(defender, damage);

      // Record turn
      turns.push({
        turnNumber,
        attackingPlayerId: attackingPlayer.id,
        attacker: structuredClone(attacker),
        attackerPosition: { ...attackerPosition },
        defender: structuredClone(damagedDefender),
        defenderPosition: { ...defenderPosition },
        damage,
        defenderHpAfter: damagedDefender.hp,
      });

      // Update defending player's board with damaged unit
      const updatedDefenderBoard = updateUnit(defendingPlayer.board, defenderPosition, damagedDefender);
      if (currentAttackingPlayer === 1) {
        currentPlayer2 = updatePlayerBoard(currentPlayer2, updatedDefenderBoard);
      } else {
        currentPlayer1 = updatePlayerBoard(currentPlayer1, updatedDefenderBoard);
      }

      // Switch turns
      currentAttackingPlayer = currentAttackingPlayer === 1 ? 2 : 1;
      turnNumber++;
    }

    // Determine winner and loser
    const winner = !hasLost(currentPlayer1) ? currentPlayer1 : currentPlayer2;
    const loser = !hasLost(currentPlayer1) ? currentPlayer2 : currentPlayer1;

    return {
      turns,
      winner,
      loser,
    };
  }
}