import { Board, createEmptyBoard, placeUnit } from './Board';
import { createUnit } from './Unit';
import { unitData } from './unitData';
import { createPosition } from './BoardPosition';

/**
 * Predefined board compositions for testing
 */

/**
 * Simple board with one warrior in front center
 */
export function createSimpleWarriorBoard(): Board {
  let board = createEmptyBoard();
  const warrior = createUnit(unitData['warrior']!, 0, 0);
  board = placeUnit(board, warrior, createPosition('front', 1));
  return board;
}

/**
 * Simple board with one knight in front center
 */
export function createSimpleKnightBoard(): Board {
  let board = createEmptyBoard();
  const knight = createUnit(unitData['knight']!, 0, 0);
  board = placeUnit(board, knight, createPosition('front', 1));
  return board;
}

/**
 * Balanced board with 3 front row units
 */
export function createBalancedBoard(playerNum: number): Board {
  let board = createEmptyBoard();

  // Front row: 3 knights
  board = placeUnit(
    board,
    createUnit({ ...unitData['knight']!, id: `knight-${playerNum}-0` }, 0, 0),
    createPosition('front', 0)
  );
  board = placeUnit(
    board,
    createUnit({ ...unitData['knight']!, id: `knight-${playerNum}-1` }, 0, 0),
    createPosition('front', 1)
  );
  board = placeUnit(
    board,
    createUnit({ ...unitData['knight']!, id: `knight-${playerNum}-2` }, 0, 0),
    createPosition('front', 2)
  );

  return board;
}

/**
 * Mixed composition with front and back units
 */
export function createMixedBoard(playerNum: number): Board {
  let board = createEmptyBoard();

  // Front row: 2 warriors
  board = placeUnit(
    board,
    createUnit({ ...unitData['warrior']!, id: `warrior-${playerNum}-0` }, 0, 0),
    createPosition('front', 0)
  );
  board = placeUnit(
    board,
    createUnit({ ...unitData['warrior']!, id: `warrior-${playerNum}-1` }, 0, 0),
    createPosition('front', 2)
  );

  // Back row: 2 knights
  board = placeUnit(
    board,
    createUnit({ ...unitData['knight']!, id: `knight-${playerNum}-0` }, 0, 0),
    createPosition('back', 0)
  );
  board = placeUnit(
    board,
    createUnit({ ...unitData['knight']!, id: `knight-${playerNum}-1` }, 0, 0),
    createPosition('back', 1)
  );

  return board;
}