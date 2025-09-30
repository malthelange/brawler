import Phaser from 'phaser';
import { BattleResult, BattleTurn } from '@/game/core/BattleController';
import { Player } from '@/game/core/Player';
import { BoardSlot } from '@/game/core/Board';

/**
 * BattlePresenter - Handles all visual rendering and animation
 * Renders full boards with all positions and animates battles
 */
export class BattlePresenter {
  private scene: Phaser.Scene;

  // Slot graphics keyed by "playerId:row:slot" (e.g., "player1:front:0")
  private slotGraphics: Map<string, {
    rect: Phaser.GameObjects.Rectangle;
    attackText: Phaser.GameObjects.Text;
    hpText: Phaser.GameObjects.Text;
    unitId: string | null;
  }> = new Map();

  // Layout constants
  private readonly SLOT_SIZE = 100;
  private readonly SLOT_SPACING = 40;
  private readonly ROW_SPACING = 120;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Present the complete battle with animations
   */
  public async present(battleResult: BattleResult): Promise<void> {
    // Render initial boards
    this.renderPlayerBoard(battleResult.winner, true); // Will be updated with actual player states
    this.renderPlayerBoard(battleResult.loser, false);

    // Get initial states from first turn to render correctly
    const firstTurn = battleResult.turns[0];
    if (firstTurn) {
      // Determine which player is which based on first turn
      const player1Id = firstTurn.attackingPlayerId;
      const player2Id = player1Id === battleResult.winner.id ? battleResult.loser.id : battleResult.winner.id;

      // Render with initial board states
      const player1 = player1Id === battleResult.winner.id ? battleResult.winner : battleResult.loser;
      const player2 = player2Id === battleResult.winner.id ? battleResult.winner : battleResult.loser;

      this.renderPlayerBoard(player1, true);
      this.renderPlayerBoard(player2, false);
    }

    // Animate each turn with delay
    for (const turn of battleResult.turns) {
      await this.animateTurn(turn);
      await this.delay(1000); // Wait 1 second between turns
    }

    // Show victory message
    this.showVictory(battleResult.winner.name);
  }

  /**
   * Render a player's board (all 5 positions)
   */
  private renderPlayerBoard(player: Player, isTopPlayer: boolean): void {
    const camera = this.scene.cameras.main;
    const centerX = camera.width / 2;
    const baseY = isTopPlayer ? camera.height * 0.2 : camera.height * 0.8;
    const color = isTopPlayer ? 0x4a90e2 : 0xe74c3c; // Blue for top, red for bottom

    // Render front row (3 slots)
    const frontRowY = isTopPlayer ? baseY + this.ROW_SPACING : baseY - this.ROW_SPACING;
    this.renderRow(player, 'front', 3, centerX, frontRowY, color);

    // Render back row (2 slots)
    this.renderRow(player, 'back', 2, centerX, baseY, color);
  }

  /**
   * Render a single row of slots
   */
  private renderRow(
    player: Player,
    row: 'front' | 'back',
    slotCount: number,
    centerX: number,
    y: number,
    playerColor: number
  ): void {
    const totalWidth = (slotCount * this.SLOT_SIZE) + ((slotCount - 1) * this.SLOT_SPACING);
    const startX = centerX - totalWidth / 2 + this.SLOT_SIZE / 2;

    const rowSlots = row === 'front' ? player.board.frontRow : player.board.backRow;

    for (let i = 0; i < slotCount; i++) {
      const x = startX + i * (this.SLOT_SIZE + this.SLOT_SPACING);
      const slot = rowSlots[i]!;
      this.renderSlot(player.id, slot, x, y, playerColor);
    }
  }

  /**
   * Render a single slot (empty or with unit)
   */
  private renderSlot(
    playerId: string,
    slot: BoardSlot,
    x: number,
    y: number,
    playerColor: number
  ): void {
    const key = `${playerId}:${slot.position.row}:${slot.position.slot}`;
    const hasUnit = slot.unit !== null;

    // Create rectangle
    const rect = this.scene.add.rectangle(x, y, this.SLOT_SIZE, this.SLOT_SIZE);

    if (hasUnit) {
      rect.setFillStyle(playerColor);
      rect.setStrokeStyle(4, 0xffffff);
    } else {
      rect.setStrokeStyle(4, 0x666666); // Gray outline for empty slots
    }

    // Create text elements (hidden if no unit)
    const attackText = this.scene.add.text(
      x - this.SLOT_SIZE / 2 - 25,
      y,
      hasUnit ? slot.unit!.attack.toString() : '',
      {
        fontSize: '24px',
        color: '#ff6b6b',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      }
    ).setOrigin(1, 0.5);

    const hpText = this.scene.add.text(
      x + this.SLOT_SIZE / 2 + 25,
      y,
      hasUnit ? slot.unit!.hp.toString() : '',
      {
        fontSize: '24px',
        color: '#51cf66',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      }
    ).setOrigin(0, 0.5);

    // Store graphics for later updates
    this.slotGraphics.set(key, {
      rect,
      attackText,
      hpText,
      unitId: hasUnit ? slot.unit!.id : null,
    });
  }

  /**
   * Animate a single turn (attack)
   */
  private async animateTurn(turn: BattleTurn): Promise<void> {
    // Find the defender's slot graphics using position
    const defenderKey = this.findSlotKeyByUnit(turn.defender.id);
    if (!defenderKey) return;

    const defenderGraphics = this.slotGraphics.get(defenderKey);
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

    // If unit died (HP = 0), fade it out
    if (turn.defenderHpAfter <= 0) {
      this.scene.tweens.add({
        targets: [defenderGraphics.rect, defenderGraphics.attackText, defenderGraphics.hpText],
        alpha: 0.3,
        duration: 300,
      });
    }
  }

  /**
   * Find slot key by unit ID
   */
  private findSlotKeyByUnit(unitId: string): string | null {
    for (const [key, graphics] of this.slotGraphics.entries()) {
      if (graphics.unitId === unitId) {
        return key;
      }
    }
    return null;
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