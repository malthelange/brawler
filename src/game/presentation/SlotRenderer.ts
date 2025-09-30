import Phaser from 'phaser';
import { BoardSlot } from '@/game/core/Board';

/**
 * Graphics elements for a single slot
 */
interface SlotGraphics {
  rect: Phaser.GameObjects.Rectangle;
  attackText: Phaser.GameObjects.Text;
  hpText: Phaser.GameObjects.Text;
  unitId: string | null;
}

/**
 * SlotRenderer - Handles rendering individual slots and unit animations
 * Manages slot graphics and unit stat display
 */
export class SlotRenderer {
  private scene: Phaser.Scene;

  // Slot graphics keyed by "playerId:row:slot" (e.g., "player1:front:0")
  private slotGraphics: Map<string, SlotGraphics> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Render a single slot (empty or with unit)
   */
  public renderSlot(
    playerId: string,
    slot: BoardSlot,
    x: number,
    y: number,
    playerColor: number,
    slotSize: number
  ): void {
    const key = `${playerId}:${slot.position.row}:${slot.position.slot}`;
    const hasUnit = slot.unit !== null;

    // Create rectangle
    const rect = this.scene.add.rectangle(x, y, slotSize, slotSize);

    if (hasUnit) {
      rect.setFillStyle(playerColor);
      rect.setStrokeStyle(4, 0xffffff);
    } else {
      rect.setStrokeStyle(4, 0x666666); // Gray outline for empty slots
    }

    // Create text elements (hidden if no unit)
    const attackText = this.scene.add.text(
      x - slotSize / 2 - 0,
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
      x + slotSize / 2 + 0,
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
   * Get slot graphics by unit ID
   */
  public getSlotGraphicsByUnitId(unitId: string): SlotGraphics | null {
    for (const [, graphics] of this.slotGraphics.entries()) {
      if (graphics.unitId === unitId) {
        return graphics;
      }
    }
    return null;
  }

  /**
   * Animate damage on a unit (flash and HP update)
   */
  public async animateDamage(
    unitId: string,
    _damage: number,
    hpAfter: number
  ): Promise<void> {
    const graphics = this.getSlotGraphicsByUnitId(unitId);
    if (!graphics) return;

    // Flash defender
    this.scene.tweens.add({
      targets: graphics.rect,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 1,
    });

    // Wait a bit before updating HP
    await this.delay(200);

    // Update HP text
    graphics.hpText.setText(hpAfter.toString());

    // Pulse HP text if damaged
    this.scene.tweens.add({
      targets: graphics.hpText,
      scale: 1.5,
      duration: 150,
      yoyo: true,
    });
  }

  /**
   * Animate unit death (fade out)
   */
  public animateDeath(unitId: string): void {
    const graphics = this.getSlotGraphicsByUnitId(unitId);
    if (!graphics) return;

    this.scene.tweens.add({
      targets: [graphics.rect, graphics.attackText, graphics.hpText],
      alpha: 0.3,
      duration: 300,
    });
  }

  /**
   * Get the position of a unit's slot for effects
   */
  public getSlotPosition(unitId: string): { x: number; y: number } | null {
    const graphics = this.getSlotGraphicsByUnitId(unitId);
    if (!graphics) return null;

    return {
      x: graphics.rect.x,
      y: graphics.rect.y,
    };
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
