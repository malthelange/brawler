import { Unit, isAlive } from './Unit';
import { BoardPosition } from './BoardPosition';

/**
 * A slot on the board that can contain a unit or be empty
 */
export interface BoardSlot {
  position: BoardPosition;
  unit: Unit | null;
}

/**
 * A board containing unit positions
 * Front row: 3 slots (0, 1, 2)
 * Back row: 2 slots (0, 1)
 */
export interface Board {
  frontRow: [BoardSlot, BoardSlot, BoardSlot];
  backRow: [BoardSlot, BoardSlot];
}

/**
 * Create an empty board
 */
export function createEmptyBoard(): Board {
  return {
    frontRow: [
      { position: { row: 'front', slot: 0 }, unit: null },
      { position: { row: 'front', slot: 1 }, unit: null },
      { position: { row: 'front', slot: 2 }, unit: null },
    ],
    backRow: [
      { position: { row: 'back', slot: 0 }, unit: null },
      { position: { row: 'back', slot: 1 }, unit: null },
    ],
  };
}

/**
 * Get all units on the board (including dead ones)
 */
export function getAllUnits(board: Board): Unit[] {
  const units: Unit[] = [];

  for (const slot of board.frontRow) {
    if (slot.unit) units.push(slot.unit);
  }
  for (const slot of board.backRow) {
    if (slot.unit) units.push(slot.unit);
  }

  return units;
}

/**
 * Get only alive units on the board
 */
export function getAliveUnits(board: Board): Unit[] {
  return getAllUnits(board).filter(isAlive);
}

/**
 * Check if board has any alive units
 */
export function hasAliveUnits(board: Board): boolean {
  return getAliveUnits(board).length > 0;
}

/**
 * Get alive units in front row
 */
export function getAliveFrontRow(board: Board): Unit[] {
  return board.frontRow
    .map(slot => slot.unit)
    .filter((unit): unit is Unit => unit !== null && isAlive(unit));
}

/**
 * Get alive units in back row
 */
export function getAliveBackRow(board: Board): Unit[] {
  return board.backRow
    .map(slot => slot.unit)
    .filter((unit): unit is Unit => unit !== null && isAlive(unit));
}

/**
 * Get unit at specific position
 */
export function getUnitAtPosition(board: Board, position: BoardPosition): Unit | null {
  const slot = getSlotAtPosition(board, position);
  return slot?.unit ?? null;
}

/**
 * Get slot at specific position
 */
function getSlotAtPosition(board: Board, position: BoardPosition): BoardSlot | null {
  if (position.row === 'front' && position.slot >= 0 && position.slot <= 2) {
    return board.frontRow[position.slot] ?? null;
  }
  if (position.row === 'back' && position.slot >= 0 && position.slot <= 1) {
    return board.backRow[position.slot] ?? null;
  }
  return null;
}

/**
 * Place a unit at a position (returns new board, pure function)
 */
export function placeUnit(board: Board, unit: Unit, position: BoardPosition): Board {
  const newBoard = structuredClone(board);

  if (position.row === 'front' && position.slot >= 0 && position.slot <= 2) {
    newBoard.frontRow[position.slot] = { position, unit };
  } else if (position.row === 'back' && position.slot >= 0 && position.slot <= 1) {
    newBoard.backRow[position.slot] = { position, unit };
  }

  return newBoard;
}

/**
 * Remove unit from a position (returns new board, pure function)
 */
export function removeUnit(board: Board, position: BoardPosition): Board {
  const newBoard = structuredClone(board);

  if (position.row === 'front' && position.slot >= 0 && position.slot <= 2) {
    newBoard.frontRow[position.slot]!.unit = null;
  } else if (position.row === 'back' && position.slot >= 0 && position.slot <= 1) {
    newBoard.backRow[position.slot]!.unit = null;
  }

  return newBoard;
}

/**
 * Update a unit at a position (returns new board, pure function)
 */
export function updateUnit(board: Board, position: BoardPosition, unit: Unit): Board {
  return placeUnit(board, unit, position);
}

/**
 * Find the position of a unit on the board
 */
export function findUnitPosition(board: Board, unitId: string): BoardPosition | null {
  for (const slot of board.frontRow) {
    if (slot.unit?.id === unitId) return slot.position;
  }
  for (const slot of board.backRow) {
    if (slot.unit?.id === unitId) return slot.position;
  }
  return null;
}

/**
 * Get all valid target positions (front row first, then back row if front is empty)
 */
export function getValidTargets(board: Board): BoardPosition[] {
  const aliveFront = board.frontRow.filter(slot => slot.unit && isAlive(slot.unit));

  // If front row has units, only they can be targeted
  if (aliveFront.length > 0) {
    return aliveFront.map(slot => slot.position);
  }

  // Otherwise, back row can be targeted
  const aliveBack = board.backRow.filter(slot => slot.unit && isAlive(slot.unit));
  return aliveBack.map(slot => slot.position);
}