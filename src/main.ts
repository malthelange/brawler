import Phaser from 'phaser';
import { gameConfig } from '@/config/gameConfig';

// Initialize the Phaser game
const game = new Phaser.Game(gameConfig);

// Make game instance available globally for debugging
(window as any).game = game;