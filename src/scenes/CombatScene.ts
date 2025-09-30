import Phaser from 'phaser';

export class CombatScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CombatScene' });
  }

  create(): void {
    // Display "Hello Combat" in the center of the screen
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.add.text(centerX, centerY, 'Hello Combat', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);
  }
}