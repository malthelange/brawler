import { describe, it, expect } from 'vitest';
import { createPlayer, getPlayerAliveUnits, hasLost, updatePlayerBoard } from '../Player';
import { createEmptyBoard, placeUnit } from '../Board';
import { createUnit } from '../Unit';
import { createPosition } from '../BoardPosition';

describe('Player', () => {
  describe('createPlayer', () => {
    it('should create a player with given id, name, and board', () => {
      const board = createEmptyBoard();
      const player = createPlayer('player1', 'Alice', board);

      expect(player.id).toBe('player1');
      expect(player.name).toBe('Alice');
      expect(player.board).toBe(board);
    });
  });

  describe('getPlayerAliveUnits', () => {
    it('should return all alive units from player board', () => {
      let board = createEmptyBoard();
      const unit1 = createUnit({ id: 'warrior1', maxHp: 3, attack: 2 }, 0, 0);
      const unit2 = createUnit({ id: 'warrior2', maxHp: 3, attack: 2 }, 0, 0);

      board = placeUnit(board, unit1, createPosition('front', 0));
      board = placeUnit(board, unit2, createPosition('front', 1));

      const player = createPlayer('p1', 'Alice', board);
      const aliveUnits = getPlayerAliveUnits(player);

      expect(aliveUnits).toHaveLength(2);
    });

    it('should not return dead units', () => {
      let board = createEmptyBoard();
      const aliveUnit = createUnit({ id: 'alive', maxHp: 3, attack: 2 }, 0, 0);
      const deadUnit = createUnit({ id: 'dead', maxHp: 3, attack: 2 }, 0, 0);
      deadUnit.hp = 0;

      board = placeUnit(board, aliveUnit, createPosition('front', 0));
      board = placeUnit(board, deadUnit, createPosition('front', 1));

      const player = createPlayer('p1', 'Alice', board);
      const aliveUnits = getPlayerAliveUnits(player);

      expect(aliveUnits).toHaveLength(1);
      expect(aliveUnits[0]?.id).toBe('alive');
    });
  });

  describe('hasLost', () => {
    it('should return false when player has alive units', () => {
      let board = createEmptyBoard();
      const unit = createUnit({ id: 'warrior', maxHp: 3, attack: 2 }, 0, 0);
      board = placeUnit(board, unit, createPosition('front', 0));

      const player = createPlayer('p1', 'Alice', board);

      expect(hasLost(player)).toBe(false);
    });

    it('should return true when player has no units', () => {
      const board = createEmptyBoard();
      const player = createPlayer('p1', 'Alice', board);

      expect(hasLost(player)).toBe(true);
    });

    it('should return true when all units are dead', () => {
      let board = createEmptyBoard();
      const deadUnit = createUnit({ id: 'dead', maxHp: 3, attack: 2 }, 0, 0);
      deadUnit.hp = 0;
      board = placeUnit(board, deadUnit, createPosition('front', 0));

      const player = createPlayer('p1', 'Alice', board);

      expect(hasLost(player)).toBe(true);
    });
  });

  describe('updatePlayerBoard', () => {
    it('should update player board and return new player', () => {
      const oldBoard = createEmptyBoard();
      let newBoard = createEmptyBoard();
      const unit = createUnit({ id: 'warrior', maxHp: 3, attack: 2 }, 0, 0);
      newBoard = placeUnit(newBoard, unit, createPosition('front', 0));

      const player = createPlayer('p1', 'Alice', oldBoard);
      const updatedPlayer = updatePlayerBoard(player, newBoard);

      expect(updatedPlayer.id).toBe('p1');
      expect(updatedPlayer.name).toBe('Alice');
      expect(updatedPlayer.board).not.toBe(oldBoard);
      expect(getPlayerAliveUnits(updatedPlayer)).toHaveLength(1);
    });
  });
});