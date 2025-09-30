# Brawler - Auto Battler Game

Browser-based auto-battler game built with Phaser 3, TypeScript, and Vite.

## Tech Stack

- **Phaser 3** - Game engine
- **TypeScript** - Strict mode enabled
- **Vite** - Dev server with hot reload

## Architecture Principles

- **Separation of Concerns**: Game state, combat logic, and rendering are completely separate
- **Pure Functions**: All combat calculations use pure functions
- **Data-Driven Design**: Units and abilities defined in JSON
- **Clean Structure**: Organized by feature/responsibility

## Project Structure

```
src/
├── main.ts                    # Phaser game entry point
├── config/
│   └── gameConfig.ts          # Phaser configuration (1920x1080)
├── scenes/
│   └── CombatScene.ts         # Main combat scene
├── game/
│   ├── entities/              # Unit entities and types
│   └── systems/               # Combat logic systems
```

## Current Status

✅ Project setup complete
✅ CombatScene displaying "Hello Combat"

## Week 1 Goal - Minimal Viable Combat

### Requirements

1. **Two units on screen** with health bars (simple colored rectangles)
2. **Turn-based combat**: Alternating turns
3. **Damage formula**: Direct damage equal to attacker's attack stat
4. **Visual feedback**: Damage numbers, health bar updates
5. **Victory detection**: When one unit reaches 0 HP

### Unit Entity Structure

```typescript
{
  id: string,
  hp: number,
  maxHp: number,
  attack: number,
  x: number,
  y: number
}
```

### Test Units

- **Warrior**: HP 3, Attack 2
- **Knight**: HP 4, Attack 1

## Next Steps

1. Define Unit type and interface
2. Create unit data file (JSON/TS)
3. Implement unit rendering system (colored rectangles + health bars)
4. Build combat system (turn order, damage calculation)
5. Add visual feedback (damage numbers, animations)
6. Implement victory detection

## Future Features (Post Week 1)

- Multiple units per side
- Abilities system
- Shop/economy
- Unit progression
- Multiplayer

## Development Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run preview  # Preview production build
```

## Notes

- Keep it simple - iterate quickly
- Focus on core combat loop first
- Add polish after mechanics work