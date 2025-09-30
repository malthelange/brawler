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
│   │   ├── BoardPosition.ts   # Board position types
│   │   ├── Board.ts           # Board entity & functions
│   │   ├── Player.ts          # Player entity & functions
│   │   ├── boardCompositions.ts # Predefined board setups
│   │   ├── BattleController.ts # Combat logic
│   │   └── __tests__/         # Unit tests (29 tests)
│   ├── presentation/          # Rendering & visuals
│   │   └── BattlePresenter.ts # Battle animations & display
│   └── flow/                  # Orchestration & game flow
│       └── BattleOrchestrator.ts # Battle lifecycle coordination
```

## Architecture

The codebase follows a three-layer architecture:

### Core Layer (`game/core/`)
Pure game logic and state management. Contains:
- Entity definitions (Unit, Board, Player, BoardPosition)
- Game data (unitData, boardCompositions)
- Combat logic (BattleController)
- All business rules
- Pure functions for board manipulation
- Comprehensive unit tests (29 tests covering all entities)

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
✅ Three-layer architecture (Core/Presentation/Flow)
✅ **Player & Board system implemented**
✅ Unit types and data defined
✅ BattleController - Board-based combat logic
✅ BattlePresenter - Animated rendering system (basic)
✅ Complete battle system working
✅ Vitest testing framework - 29 tests passing
✅ Dynamic resolution with aspect ratio maintained (16:9)

## Game Concepts

### Players
Each player has:
- Unique ID
- Name
- Board with units

### Boards
Board layout: **5 positions**
- **Front Row**: 3 slots (positions 0, 1, 2)
- **Back Row**: 2 slots (positions 0, 1)

Each slot can be:
- Empty
- Occupied by a unit

### Combat Rules
1. **Turn Order**: Players alternate turns
2. **Targeting**: Front row must be targeted first
   - Back row can only be targeted when front row is empty
3. **Attacking**: First alive unit from attacking player's board attacks
4. **Damage**: Direct damage (attacker's attack value)
5. **Victory**: Player wins when opponent has no alive units

### Unit Stats
- **HP**: Health points (current/max)
- **Attack**: Damage dealt per attack

**Example Units:**
- Warrior: 3 HP, 2 Attack
- Knight: 4 HP, 1 Attack

## Development Roadmap

### ✅ Completed - Core Battle System
1. Unit type and interface ✓
2. Player & Board system ✓
3. Combat logic (BattleController) ✓
4. Turn-based combat with board positioning ✓
5. Basic visual feedback ✓
6. Victory detection ✓
7. Comprehensive test coverage (29 tests) ✓

### 🎯 Next Steps - Enhanced Visualization
1. **Update BattlePresenter to render full boards**
   - Display all 5 positions per player
   - Show empty slots as outlined rectangles
   - Position units correctly on the board
   - Visualize front row vs back row

2. **Improve board compositions**
   - Add more variety (different unit placements)
   - Create balanced team compositions
   - Add more unit types

3. **Enhanced animations**
   - Attack animations (unit movement/flash)
   - Better damage visualization
   - Death animations
   - Turn indicators

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