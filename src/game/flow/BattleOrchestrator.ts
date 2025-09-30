import Phaser from 'phaser';
import { Player } from '@/game/core/Player';
import { BattleController } from '@/game/core/BattleController';
import { BattlePresenter } from '@/game/presentation/BattlePresenter';

/**
 * BattleOrchestrator - Flow layer
 * Coordinates battle flow between core logic and presentation
 * Handles battle lifecycle and state transitions
 */
export class BattleOrchestrator {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Start and present a battle between two players
   */
  public async startBattle(player1: Player, player2: Player): Promise<void> {
    // Step 1: Evaluate battle using core logic
    const battleResult = BattleController.evaluate(player1, player2);

    // Step 2: Present battle using presentation layer
    const presenter = new BattlePresenter(this.scene);
    await presenter.present(battleResult);

    // Future: Handle post-battle actions (rewards, next scene, etc.)
  }
}