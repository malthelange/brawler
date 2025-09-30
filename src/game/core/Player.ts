import { Unit } from './Unit';
import { Board, getAliveUnits, hasAliveUnits } from './Board';

/**
 * A player in the game
 */
export interface Player {
  id: string;
  name: string;
  board: Board;
}

/**
 * Create a player with a board
 */
export function createPlayer(id: string, name: string, board: Board): Player {
  return {
    id,
    name,
    board,
  };
}

/**
 * Get all alive units for a player
 */
export function getPlayerAliveUnits(player: Player): Unit[] {
  return getAliveUnits(player.board);
}

/**
 * Check if player has lost (no alive units)
 */
export function hasLost(player: Player): boolean {
  return !hasAliveUnits(player.board);
}

/**
 * Update player's board (returns new player, pure function)
 */
export function updatePlayerBoard(player: Player, board: Board): Player {
  return {
    ...player,
    board,
  };
}