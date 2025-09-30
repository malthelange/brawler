import Phaser from 'phaser';
import { BattleResult, BattleTurn } from '@/game/core/BattleController';
import { BoardRenderer } from './BoardRenderer';
import { SlotRenderer } from './SlotRenderer';

/**
 * BattlePresenter - Orchestrates battle presentation
 * Coordinates BoardRenderer and SlotRenderer to present battles with timing
 */
export class BattlePresenter {
  private scene: Phaser.Scene;
  private boardRenderer: BoardRenderer;
  private slotRenderer: SlotRenderer;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.slotRenderer = new SlotRenderer(scene);
    this.boardRenderer = new BoardRenderer(scene, this.slotRenderer);
  }

  /**
   * Present the complete battle with animations
   */
  public async present(battleResult: BattleResult): Promise<void> {
    // Determine which player is which based on first turn
    const firstTurn = battleResult.turns[0];
    if (!firstTurn) return;

    const player1Id = firstTurn.attackingPlayerId;
    const player2Id = player1Id === battleResult.winner.id ? battleResult.loser.id : battleResult.winner.id;

    // Render boards once with correct player order
    const player1 = player1Id === battleResult.winner.id ? battleResult.winner : battleResult.loser;
    const player2 = player2Id === battleResult.winner.id ? battleResult.winner : battleResult.loser;

    this.boardRenderer.renderBoard(player1, true);
    this.boardRenderer.renderBoard(player2, false);

    // Animate each turn with delay
    for (const turn of battleResult.turns) {
      await this.animateTurn(turn);
      await this.delay(1000); // Wait 1 second between turns
    }

    // Show victory message
    this.showVictory(battleResult.winner.name);
  }

  /**
   * Animate a single turn (attack)
   */
  private async animateTurn(turn: BattleTurn): Promise<void> {
    const defenderPosition = this.slotRenderer.getSlotPosition(turn.defender.id);
    if (!defenderPosition) return;

    // Show damage number at defender's position
    this.showDamageNumber(defenderPosition.x, defenderPosition.y, turn.damage);

    // Animate damage on defender
    await this.slotRenderer.animateDamage(turn.defender.id, turn.damage, turn.defenderHpAfter);

    // If unit died (HP = 0), fade it out
    if (turn.defenderHpAfter <= 0) {
      this.slotRenderer.animateDeath(turn.defender.id);
    }
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
  private showVictory(winnerName: string): void {
    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;

    const victoryText = this.scene.add.text(centerX, centerY - 100, `${winnerName.toUpperCase()} WINS!`, {
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
