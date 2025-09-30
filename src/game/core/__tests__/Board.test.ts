import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  getAllUnits,
  getAliveUnits,
  hasAliveUnits,
  getUnitAtPosition,
  placeUnit,
  removeUnit,
  findUnitPosition,
  getValidTargets,
} from '../Board';
import { createUnit } from '../Unit';
import { createPosition } from '../BoardPosition';

describe('Board', () => {
  describe('createEmptyBoard', () => {
    it('should create a board with 3 front slots and 2 back slots', () => {
      const board = createEmptyBoard();

      expect(board.frontRow).toHaveLength(3);
      expect(board.backRow).toHaveLength(2);
    });

    it('should have all slots empty', () => {
      const board = createEmptyBoard();

      expect(board.frontRow.every(slot => slot.unit === null)).toBe(true);
      expect(board.backRow.every(slot => slot.unit === null)).toBe(true);
    });
  });

  describe('placeUnit and getUnitAtPosition', () => {
    it('should place unit at front row position', () => {
      const board = createEmptyBoard();
      const unit = createUnit({ id: 'warrior', maxHp: 3, attack: 2 }, 0, 0);
      const position = createPosition('front', 1);

      const newBoard = placeUnit(board, unit, position);
      const placedUnit = getUnitAtPosition(newBoard, position);

      expect(placedUnit?.id).toBe('warrior');
    });

    it('should place unit at back row position', () => {
      const board = createEmptyBoard();
      const unit = createUnit({ id: 'knight', maxHp: 4, attack: 1 }, 0, 0);
      const position = createPosition('back', 0);

      const newBoard = placeUnit(board, unit, position);
      const placedUnit = getUnitAtPosition(newBoard, position);

      expect(placedUnit?.id).toBe('knight');
    });
  });

  describe('getAllUnits and getAliveUnits', () => {
    it('should return all units including dead ones', () => {
      let board = createEmptyBoard();
      const aliveUnit = createUnit({ id: 'alive', maxHp: 3, attack: 2 }, 0, 0);
      const deadUnit = createUnit({ id: 'dead', maxHp: 3, attack: 2 }, 0, 0);
      deadUnit.hp = 0;

      board = placeUnit(board, aliveUnit, createPosition('front', 0));
      board = placeUnit(board, deadUnit, createPosition('front', 1));

      expect(getAllUnits(board)).toHaveLength(2);
    });

    it('should return only alive units', () => {
      let board = createEmptyBoard();
      const aliveUnit = createUnit({ id: 'alive', maxHp: 3, attack: 2 }, 0, 0);
      const deadUnit = createUnit({ id: 'dead', maxHp: 3, attack: 2 }, 0, 0);
      deadUnit.hp = 0;

      board = placeUnit(board, aliveUnit, createPosition('front', 0));
      board = placeUnit(board, deadUnit, createPosition('front', 1));

      const aliveUnits = getAliveUnits(board);
      expect(aliveUnits).toHaveLength(1);
      expect(aliveUnits[0]?.id).toBe('alive');
    });
  });

  describe('hasAliveUnits', () => {
    it('should return true when board has alive units', () => {
      let board = createEmptyBoard();
      const unit = createUnit({ id: 'warrior', maxHp: 3, attack: 2 }, 0, 0);
      board = placeUnit(board, unit, createPosition('front', 0));

      expect(hasAliveUnits(board)).toBe(true);
    });

    it('should return false when board has no units', () => {
      const board = createEmptyBoard();

      expect(hasAliveUnits(board)).toBe(false);
    });

    it('should return false when all units are dead', () => {
      let board = createEmptyBoard();
      const deadUnit = createUnit({ id: 'dead', maxHp: 3, attack: 2 }, 0, 0);
      deadUnit.hp = 0;
      board = placeUnit(board, deadUnit, createPosition('front', 0));

      expect(hasAliveUnits(board)).toBe(false);
    });
  });

  describe('removeUnit', () => {
    it('should remove unit from position', () => {
      let board = createEmptyBoard();
      const unit = createUnit({ id: 'warrior', maxHp: 3, attack: 2 }, 0, 0);
      const position = createPosition('front', 1);

      board = placeUnit(board, unit, position);
      board = removeUnit(board, position);

      expect(getUnitAtPosition(board, position)).toBeNull();
    });
  });

  describe('findUnitPosition', () => {
    it('should find unit position on board', () => {
      let board = createEmptyBoard();
      const unit = createUnit({ id: 'warrior', maxHp: 3, attack: 2 }, 0, 0);
      const expectedPosition = createPosition('front', 2);

      board = placeUnit(board, unit, expectedPosition);
      const foundPosition = findUnitPosition(board, 'warrior');

      expect(foundPosition?.row).toBe('front');
      expect(foundPosition?.slot).toBe(2);
    });

    it('should return null if unit not found', () => {
      const board = createEmptyBoard();
      const position = findUnitPosition(board, 'nonexistent');

      expect(position).toBeNull();
    });
  });

  describe('getValidTargets', () => {
    it('should return front row units as valid targets', () => {
      let board = createEmptyBoard();
      const unit1 = createUnit({ id: 'front1', maxHp: 3, attack: 2 }, 0, 0);
      const unit2 = createUnit({ id: 'front2', maxHp: 3, attack: 2 }, 0, 0);

      board = placeUnit(board, unit1, createPosition('front', 0));
      board = placeUnit(board, unit2, createPosition('front', 2));

      const targets = getValidTargets(board);
      expect(targets).toHaveLength(2);
      expect(targets.every(t => t.row === 'front')).toBe(true);
    });

    it('should return back row units when front row is empty', () => {
      let board = createEmptyBoard();
      const unit = createUnit({ id: 'back1', maxHp: 3, attack: 2 }, 0, 0);

      board = placeUnit(board, unit, createPosition('back', 0));

      const targets = getValidTargets(board);
      expect(targets).toHaveLength(1);
      expect(targets[0]?.row).toBe('back');
    });

    it('should not return back row units when front row has alive units', () => {
      let board = createEmptyBoard();
      const frontUnit = createUnit({ id: 'front', maxHp: 3, attack: 2 }, 0, 0);
      const backUnit = createUnit({ id: 'back', maxHp: 3, attack: 2 }, 0, 0);

      board = placeUnit(board, frontUnit, createPosition('front', 0));
      board = placeUnit(board, backUnit, createPosition('back', 0));

      const targets = getValidTargets(board);
      expect(targets).toHaveLength(1);
      expect(targets[0]?.row).toBe('front');
    });
  });
});