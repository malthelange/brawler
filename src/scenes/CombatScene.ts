import Phaser from 'phaser';
import { createUnit } from '@/game/core/Unit';
import { unitData } from '@/game/core/unitData';
import { BattleOrchestrator } from '@/game/flow/BattleOrchestrator';

export class CombatScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CombatScene' });
  }

  create(): void {
    // Calculate dynamic positions based on camera size
    const camera = this.cameras.main;
    const centerX = camera.width / 2;
    const topY = camera.height * 0.25;
    const bottomY = camera.height * 0.75;

    // Create two units for battle
    const warrior = createUnit(unitData['warrior']!, centerX, topY);
    const knight = createUnit(unitData['knight']!, centerX, bottomY);

    // Start battle using flow orchestrator
    const orchestrator = new BattleOrchestrator(this);
    orchestrator.startBattle(warrior, knight);
  }
}