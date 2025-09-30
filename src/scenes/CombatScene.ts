import Phaser from 'phaser';
import { createUnit } from '@/game/entities/Unit';
import { unitData } from '@/game/entities/unitData';
import { BattleController } from '@/game/systems/BattleController';
import { BattlePresenter } from '@/game/systems/BattlePresenter';

export class CombatScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CombatScene' });
  }

  create(): void {
    // Create two units for battle
    const warrior = createUnit(unitData['warrior']!, 400, 540);
    const knight = createUnit(unitData['knight']!, 1520, 540);

    // Evaluate the complete battle
    const battleResult = BattleController.evaluate(warrior, knight);

    // Present the battle with animations
    const presenter = new BattlePresenter(this);
    presenter.present(battleResult);
  }
}