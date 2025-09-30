import Phaser from 'phaser';
import { CombatScene } from '@/scenes/CombatScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: 'game-container',
  backgroundColor: '#2d2d2d',
  scene: [CombatScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};