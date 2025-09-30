import Phaser from 'phaser';
import { Player } from '@/game/core/Player';
import { SlotRenderer } from './SlotRenderer';

/**
 * BoardRenderer - Handles board layout and positioning
 * Renders the 5-slot board structure (3 front, 2 back)
 */
export class BoardRenderer {
  private scene: Phaser.Scene;
  private slotRenderer: SlotRenderer;

  // Layout constants
  private readonly SLOT_SIZE = 100;
  private readonly SLOT_SPACING = 40;
  private readonly ROW_SPACING = 120;

  constructor(scene: Phaser.Scene, slotRenderer: SlotRenderer) {
    this.scene = scene;
    this.slotRenderer = slotRenderer;
  }

  /**
   * Render a player's complete board (all 5 positions)
   */
  public renderBoard(player: Player, isTopPlayer: boolean): void {
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
      this.slotRenderer.renderSlot(player.id, slot, x, y, playerColor, this.SLOT_SIZE);
    }
  }

  /**
   * Get slot size (useful for external positioning calculations)
   */
  public getSlotSize(): number {
    return this.SLOT_SIZE;
  }
}
