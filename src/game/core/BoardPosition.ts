/**
 * Board positioning types
 */

export type Row = 'front' | 'back';

export interface BoardPosition {
  row: Row;
  slot: number; // 0-2 for front row, 0-1 for back row
}

/**
 * Create a board position
 */
export function createPosition(row: Row, slot: number): BoardPosition {
  // Validate slot number based on row
  if (row === 'front' && (slot < 0 || slot > 2)) {
    throw new Error('Front row slot must be 0-2');
  }
  if (row === 'back' && (slot < 0 || slot > 1)) {
    throw new Error('Back row slot must be 0-1');
  }

  return { row, slot };
}

/**
 * Check if two positions are equal
 */
export function positionsEqual(pos1: BoardPosition, pos2: BoardPosition): boolean {
  return pos1.row === pos2.row && pos1.slot === pos2.slot;
}

/**
 * Get a readable string representation of a position
 */
export function positionToString(pos: BoardPosition): string {
  return `${pos.row}-${pos.slot}`;
}