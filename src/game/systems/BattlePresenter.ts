import Phaser from 'phaser';
import { Unit } from '@/game/entities/Unit';
import { BattleResult, BattleTurn } from './BattleController';

/**
 * BattlePresenter - Handles all visual rendering and animation
 * Takes battle results from BattleController and presents them with timing
 */
export class BattlePresenter {
  private scene: Phaser.Scene;
  private unit1Graphics: { rect: Phaser.GameObjects.Rectangle; attackText: Phaser.GameObjects.Text; hpText: Phaser.GameObjects.Text; unitId: string } | null = null;
  private unit2Graphics: { rect: Phaser.GameObjects.Rectangle; attackText: Phaser.GameObjects.Text; hpText: Phaser.GameObjects.Text; unitId: string } | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Present the complete battle with animations
   */
  public async present(battleResult: BattleResult): Promise<void> {
    // Get initial unit states from first turn
    const firstTurn = battleResult.turns[0];
    if (!firstTurn) return;

    const unit1 = firstTurn.attacker;
    const unit2 = firstTurn.defender;

    // Render initial units
    this.renderUnit1(unit1);
    this.renderUnit2(unit2);

    // Animate each turn with delay
    for (const turn of battleResult.turns) {
      await this.animateTurn(turn);
      await this.delay(1000); // Wait 1 second between turns
    }

    // Show victory message
    this.showVictory(battleResult.winner);
  }

  /**
   * Render unit 1 (left side, blue)
   */
  private renderUnit1(unit: Unit): void {
    const x = 400;
    const y = 540;
    const width = 120;
    const height = 120;
    const color = 0x4a90e2; // Blue

    // Create rectangle
    const rect = this.scene.add.rectangle(x, y, width, height, color);
    rect.setStrokeStyle(4, 0xffffff);

    // Attack text (left side)
    const attackText = this.scene.add.text(x - width / 2 - 40, y, unit.attack.toString(), {
      fontSize: '32px',
      color: '#ff6b6b',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(1, 0.5);

    // HP text (right side)
    const hpText = this.scene.add.text(x + width / 2 + 40, y, unit.hp.toString(), {
      fontSize: '32px',
      color: '#51cf66',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);

    this.unit1Graphics = { rect, attackText, hpText, unitId: unit.id };
  }

  /**
   * Render unit 2 (right side, red)
   */
  private renderUnit2(unit: Unit): void {
    const x = 1520;
    const y = 540;
    const width = 120;
    const height = 120;
    const color = 0xe74c3c; // Red

    // Create rectangle
    const rect = this.scene.add.rectangle(x, y, width, height, color);
    rect.setStrokeStyle(4, 0xffffff);

    // Attack text (left side)
    const attackText = this.scene.add.text(x - width / 2 - 40, y, unit.attack.toString(), {
      fontSize: '32px',
      color: '#ff6b6b',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(1, 0.5);

    // HP text (right side)
    const hpText = this.scene.add.text(x + width / 2 + 40, y, unit.hp.toString(), {
      fontSize: '32px',
      color: '#51cf66',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);

    this.unit2Graphics = { rect, attackText, hpText, unitId: unit.id };
  }

  /**
   * Animate a single turn (attack)
   */
  private async animateTurn(turn: BattleTurn): Promise<void> {
    // Determine which unit is attacking
    const isUnit1Attacking = turn.attacker.id === this.unit1Graphics?.unitId;
    const defenderGraphics = isUnit1Attacking ? this.unit2Graphics : this.unit1Graphics;

    if (!defenderGraphics) return;

    // Show damage number
    this.showDamageNumber(defenderGraphics.rect.x, defenderGraphics.rect.y, turn.damage);

    // Flash defender
    this.scene.tweens.add({
      targets: defenderGraphics.rect,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 1,
    });

    // Update HP text
    await this.delay(200);
    defenderGraphics.hpText.setText(turn.defenderHpAfter.toString());

    // Pulse HP text if damaged
    this.scene.tweens.add({
      targets: defenderGraphics.hpText,
      scale: 1.5,
      duration: 150,
      yoyo: true,
    });
  }

  /**
   * Show floating damage number
   */
  private showDamageNumber(x: number, y: number, damage: number): void {
    const damageText = this.scene.add.text(x, y - 60, `-${damage}`, {
      fontSize: '48px',
      color: '#ff0000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Animate upward and fade out
    this.scene.tweens.add({
      targets: damageText,
      y: y - 120,
      alpha: 0,
      duration: 800,
      onComplete: () => damageText.destroy(),
    });
  }

  /**
   * Show victory message
   */
  private showVictory(winner: Unit): void {
    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;

    const victoryText = this.scene.add.text(centerX, centerY - 100, `${winner.id.toUpperCase()} WINS!`, {
      fontSize: '64px',
      color: '#ffd700',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Animate victory text
    victoryText.setAlpha(0);
    this.scene.tweens.add({
      targets: victoryText,
      alpha: 1,
      scale: 1.2,
      duration: 500,
      ease: 'Back.easeOut',
    });
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}