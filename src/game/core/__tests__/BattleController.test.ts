import { describe, it, expect } from 'vitest';
import { BattleController } from '@/game/core/BattleController';
import { createPlayer } from '../Player';
import { createSimpleWarriorBoard, createSimpleKnightBoard } from '../boardCompositions';

describe('BattleController', () => {
  describe('evaluate', () => {
    it('should have player1 attack first', () => {
      const player1 = createPlayer('p1', 'Player 1', createSimpleWarriorBoard());
      const player2 = createPlayer('p2', 'Player 2', createSimpleKnightBoard());

      const result = BattleController.evaluate(player1, player2);

      expect(result.turns.length).toBeGreaterThan(0);
      expect(result.turns[0]?.attackingPlayerId).toBe('p1');
      expect(result.turns[0]?.attacker.id).toBe('warrior');
      expect(result.turns[0]?.defender.id).toBe('knight');
    });

    it('should alternate turns between players', () => {
      const player1 = createPlayer('p1', 'Player 1', createSimpleWarriorBoard());
      const player2 = createPlayer('p2', 'Player 2', createSimpleKnightBoard());

      const result = BattleController.evaluate(player1, player2);

      // Turn 1: player1 attacks
      expect(result.turns[0]?.attackingPlayerId).toBe('p1');

      // Turn 2: player2 attacks
      expect(result.turns[1]?.attackingPlayerId).toBe('p2');

      // Turn 3: player1 attacks again
      expect(result.turns[2]?.attackingPlayerId).toBe('p1');
    });

    it('should apply correct damage (direct attack value)', () => {
      const player1 = createPlayer('p1', 'Player 1', createSimpleWarriorBoard());
      const player2 = createPlayer('p2', 'Player 2', createSimpleKnightBoard());

      const result = BattleController.evaluate(player1, player2);

      // First turn: warrior (attack 2) attacks knight
      expect(result.turns[0]?.damage).toBe(2);
      expect(result.turns[0]?.defenderHpAfter).toBe(2); // 4 - 2 = 2

      // Second turn: knight (attack 1) attacks warrior
      expect(result.turns[1]?.damage).toBe(1);
      expect(result.turns[1]?.defenderHpAfter).toBe(2); // 3 - 1 = 2
    });

    it('should determine correct winner', () => {
      const player1 = createPlayer('p1', 'Player 1', createSimpleWarriorBoard());
      const player2 = createPlayer('p2', 'Player 2', createSimpleKnightBoard());

      const result = BattleController.evaluate(player1, player2);

      // Warrior has higher attack, should win
      expect(result.winner.id).toBe('p1');
      expect(result.loser.id).toBe('p2');
    });

    it('should include board positions in turns', () => {
      const player1 = createPlayer('p1', 'Player 1', createSimpleWarriorBoard());
      const player2 = createPlayer('p2', 'Player 2', createSimpleKnightBoard());

      const result = BattleController.evaluate(player1, player2);

      // Both units should be in front row center (slot 1)
      expect(result.turns[0]?.attackerPosition.row).toBe('front');
      expect(result.turns[0]?.attackerPosition.slot).toBe(1);
      expect(result.turns[0]?.defenderPosition.row).toBe('front');
      expect(result.turns[0]?.defenderPosition.slot).toBe(1);
    });

    it('should complete battle when one player loses all units', () => {
      const player1 = createPlayer('p1', 'Player 1', createSimpleWarriorBoard());
      const player2 = createPlayer('p2', 'Player 2', createSimpleKnightBoard());

      const result = BattleController.evaluate(player1, player2);

      // Battle should complete with a winner
      expect(result.turns.length).toBeGreaterThan(0);
      expect(result.winner).toBeDefined();
      expect(result.loser).toBeDefined();
    });

    it('should track HP correctly through all turns', () => {
      const player1 = createPlayer('p1', 'Player 1', createSimpleWarriorBoard());
      const player2 = createPlayer('p2', 'Player 2', createSimpleKnightBoard());

      const result = BattleController.evaluate(player1, player2);

      // Turn 1: warrior attacks, knight 4 -> 2
      expect(result.turns[0]?.defenderHpAfter).toBe(2);

      // Turn 2: knight attacks, warrior 3 -> 2
      expect(result.turns[1]?.defenderHpAfter).toBe(2);

      // Turn 3: warrior attacks, knight 2 -> 0
      expect(result.turns[2]?.defenderHpAfter).toBe(0);
    });
  });
});