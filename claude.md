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
│   └── CombatScene.ts         # Scene definitions
├── game/
│   ├── core/                  # Game logic & state (pure functions)
│   │   ├── Unit.ts            # Unit entity & logic
│   │   ├── unitData.ts        # Unit data
│   │   ├── BattleController.ts # Combat logic
│   │   └── __tests__/         # Unit tests
│   ├── presentation/          # Rendering & visuals
│   │   └── BattlePresenter.ts # Battle animations & display
│   └── flow/                  # Orchestration & game flow
│       └── BattleOrchestrator.ts # Battle lifecycle coordination
```

## Architecture

The codebase follows a three-layer architecture:

### Core Layer (`game/core/`)
Pure game logic and state management. Contains:
- Entity definitions (Unit)
- Game data (unitData)
- Combat logic (BattleController)
- All business rules
- Unit tests

**Principles:** Pure functions, no side effects, fully testable

### Presentation Layer (`game/presentation/`)
Visual rendering and animations. Contains:
- BattlePresenter for battle visualization
- Phaser-specific rendering code
- Animation logic
- UI components

**Principles:** No business logic, only visual concerns

### Flow Layer (`game/flow/`)
Orchestrates game flow and coordinates between layers. Contains:
- BattleOrchestrator for battle coordination
- Scene transitions
- Player action handling
- Layer coordination

**Principles:** Thin coordination layer, delegates to core and presentation

## Current Status

✅ Project setup complete
✅ Unit types and data defined
✅ BattleController - Pure combat logic (all tests passing)
✅ BattlePresenter - Animated rendering system
✅ Complete battle system working (top/bottom layout)
✅ Vitest testing framework integrated
✅ Dynamic resolution with aspect ratio maintained (16:9)

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
npm test         # Run tests in watch mode
npm test -- --run # Run tests once
```

## Technical Notes

### Dynamic Resolution
- Base resolution: 1920x1080 (16:9 aspect ratio)
- Scale mode: FIT (maintains aspect ratio)
- All positions calculated dynamically from camera dimensions
- Units positioned at 25% (top) and 75% (bottom) of screen height

### Testing
- Vitest framework for unit tests
- BattleController has 8 passing tests
- Tests cover: turn order, damage calculation, victory detection, HP tracking

## Notes

- Keep it simple - iterate quickly
- Focus on core combat loop first
- Add polish after mechanics work