import { describe, it, expect } from 'vitest';
import { BattleController } from '@/game/core/BattleController';
import { Unit } from '@/game/core/Unit';

describe('BattleController', () => {
  describe('evaluate', () => {
    it('should have unit1 attack first', () => {
      const warrior: Unit = { id: 'warrior', hp: 3, maxHp: 3, attack: 2, x: 0, y: 0 };
      const knight: Unit = { id: 'knight', hp: 4, maxHp: 4, attack: 1, x: 0, y: 0 };

      const result = BattleController.evaluate(warrior, knight);

      expect(result.turns.length).toBeGreaterThan(0);
      expect(result.turns[0]?.attacker.id).toBe('warrior');
      expect(result.turns[0]?.defender.id).toBe('knight');
    });

    it('should alternate turns between units', () => {
      const warrior: Unit = { id: 'warrior', hp: 3, maxHp: 3, attack: 2, x: 0, y: 0 };
      const knight: Unit = { id: 'knight', hp: 4, maxHp: 4, attack: 1, x: 0, y: 0 };

      const result = BattleController.evaluate(warrior, knight);

      // Turn 1: warrior attacks knight
      expect(result.turns[0]?.attacker.id).toBe('warrior');
      expect(result.turns[0]?.defender.id).toBe('knight');

      // Turn 2: knight attacks warrior
      expect(result.turns[1]?.attacker.id).toBe('knight');
      expect(result.turns[1]?.defender.id).toBe('warrior');

      // Turn 3: warrior attacks knight again
      expect(result.turns[2]?.attacker.id).toBe('warrior');
      expect(result.turns[2]?.defender.id).toBe('knight');
    });

    it('should apply correct damage (direct attack value)', () => {
      const warrior: Unit = { id: 'warrior', hp: 3, maxHp: 3, attack: 2, x: 0, y: 0 };
      const knight: Unit = { id: 'knight', hp: 4, maxHp: 4, attack: 1, x: 0, y: 0 };

      const result = BattleController.evaluate(warrior, knight);

      // First turn: warrior (attack 2) attacks knight
      expect(result.turns[0]?.damage).toBe(2);
      expect(result.turns[0]?.defenderHpAfter).toBe(2); // 4 - 2 = 2

      // Second turn: knight (attack 1) attacks warrior
      expect(result.turns[1]?.damage).toBe(1);
      expect(result.turns[1]?.defenderHpAfter).toBe(2); // 3 - 1 = 2
    });

    it('should determine warrior as winner (higher attack)', () => {
      const warrior: Unit = { id: 'warrior', hp: 3, maxHp: 3, attack: 2, x: 0, y: 0 };
      const knight: Unit = { id: 'knight', hp: 4, maxHp: 4, attack: 1, x: 0, y: 0 };

      const result = BattleController.evaluate(warrior, knight);

      expect(result.winner.id).toBe('warrior');
      expect(result.loser.id).toBe('knight');
      expect(result.loser.hp).toBe(0);
    });

    it('should complete battle in correct number of turns', () => {
      const warrior: Unit = { id: 'warrior', hp: 3, maxHp: 3, attack: 2, x: 0, y: 0 };
      const knight: Unit = { id: 'knight', hp: 4, maxHp: 4, attack: 1, x: 0, y: 0 };

      const result = BattleController.evaluate(warrior, knight);

      // Warrior attacks: knight 4 -> 2 -> 0 (2 attacks)
      // Knight attacks: warrior 3 -> 2 (1 attack)
      // Total: 3 turns (warrior, knight, warrior)
      expect(result.turns.length).toBe(3);
    });

    it('should track HP correctly through all turns', () => {
      const warrior: Unit = { id: 'warrior', hp: 3, maxHp: 3, attack: 2, x: 0, y: 0 };
      const knight: Unit = { id: 'knight', hp: 4, maxHp: 4, attack: 1, x: 0, y: 0 };

      const result = BattleController.evaluate(warrior, knight);

      // Turn 1: warrior attacks, knight 4 -> 2
      expect(result.turns[0]?.defenderHpAfter).toBe(2);

      // Turn 2: knight attacks, warrior 3 -> 2
      expect(result.turns[1]?.defenderHpAfter).toBe(2);

      // Turn 3: warrior attacks, knight 2 -> 0
      expect(result.turns[2]?.defenderHpAfter).toBe(0);
    });

    it('should handle unit with higher HP winning', () => {
      const weakUnit: Unit = { id: 'weak', hp: 2, maxHp: 2, attack: 1, x: 0, y: 0 };
      const strongUnit: Unit = { id: 'strong', hp: 10, maxHp: 10, attack: 1, x: 0, y: 0 };

      const result = BattleController.evaluate(weakUnit, strongUnit);

      expect(result.winner.id).toBe('strong');
      expect(result.loser.id).toBe('weak');
    });

    it('should preserve unit positions in turns', () => {
      const warrior: Unit = { id: 'warrior', hp: 3, maxHp: 3, attack: 2, x: 100, y: 200 };
      const knight: Unit = { id: 'knight', hp: 4, maxHp: 4, attack: 1, x: 300, y: 400 };

      const result = BattleController.evaluate(warrior, knight);

      expect(result.turns[0]?.attacker.x).toBe(100);
      expect(result.turns[0]?.attacker.y).toBe(200);
      expect(result.turns[0]?.defender.x).toBe(300);
      expect(result.turns[0]?.defender.y).toBe(400);
    });
  });
});