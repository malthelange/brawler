import { UnitStats } from './Unit';

/**
 * Initial test units for combat system
 */
export const unitData: Record<string, UnitStats> = {
  warrior: {
    id: 'warrior',
    maxHp: 3,
    attack: 2,
  },
  knight: {
    id: 'knight',
    maxHp: 4,
    attack: 1,
  },
};