import Phaser from 'phaser';
import { createPlayer } from '@/game/core/Player';
import { createSimpleWarriorBoard, createSimpleKnightBoard } from '@/game/core/boardCompositions';
import { BattleOrchestrator } from '@/game/flow/BattleOrchestrator';

export class CombatScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CombatScene' });
  }

  create(): void {
    // Create two players with board compositions
    const player1 = createPlayer('player1', 'Player 1', createSimpleWarriorBoard());
    const player2 = createPlayer('player2', 'Player 2', createSimpleKnightBoard());

    // Start battle using flow orchestrator
    const orchestrator = new BattleOrchestrator(this);
    orchestrator.startBattle(player1, player2);
  }
}