import Phaser from 'phaser';
import { Unit } from '@/game/core/Unit';
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
   * Start and present a battle between two units
   */
  public async startBattle(unit1: Unit, unit2: Unit): Promise<void> {
    // Step 1: Evaluate battle using core logic
    const battleResult = BattleController.evaluate(unit1, unit2);

    // Step 2: Present battle using presentation layer
    const presenter = new BattlePresenter(this.scene);
    await presenter.present(battleResult);

    // Future: Handle post-battle actions (rewards, next scene, etc.)
  }
}