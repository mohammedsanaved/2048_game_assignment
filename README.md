# 2048 Game - React TypeScript Implementation

A modern implementation of the classic 2048 puzzle game built with React, TypeScript, and Vite. Features responsive design, touch controls for mobile devices, and customizable board sizes.

## 🎮 Game Overview

2048 is a sliding tile puzzle game where you combine numbered tiles to reach the 2048 tile. When two tiles with the same number touch, they merge into one with their sum. The goal is to create a tile with the number 2048.

## 🚀 Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone or download the project**

   ```bash
   cd 2048_dynamic
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 🎯 How to Play

### Objective

- Combine tiles with the same numbers to reach **2048**
- The game ends when you reach 2048 (win) or when no more moves are possible (lose)

### Controls

#### Desktop

- **Arrow Keys**: Move tiles in the corresponding direction
  - ↑ **Up Arrow**: Move tiles up
  - ↓ **Down Arrow**: Move tiles down
  - ← **Left Arrow**: Move tiles left
  - → **Right Arrow**: Move tiles right

#### Mobile/Touch Devices

- **Swipe Gestures**: Swipe in any direction to move tiles
  - Swipe up, down, left, or right to move tiles accordingly

### Game Controls

- **Restart Button**: Reset the current game
- **Board Size Buttons**: Choose different board sizes (3×3, 4×4, 5×5, 6×6)
- **Default 4×4**: Quick reset to standard 4×4 board

### Gameplay Rules

1. **Movement**: All tiles slide in the chosen direction until they hit a wall or another tile
2. **Merging**: When two tiles with the same number collide, they merge into one tile with double the value
3. **Scoring**: Your score increases by the value of merged tiles
4. **New Tiles**: After each move, a new tile (2 or 4) appears in a random empty spot
5. **Winning**: Reach the 2048 tile to win
6. **Losing**: Game ends when the board is full and no moves are possible

## 🏗️ Technical Implementation

### Technology Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules with CSS Variables
- **State Management**: React Context + useReducer
- **Utilities**: Lodash for helper functions
- **Mobile Support**: Custom touch/swipe detection
- **Responsive Design**: react-responsive library

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Board.tsx        # Main game board component
│   ├── ScoreBoard.tsx   # Score display component
│   ├── Tile.tsx         # Individual tile component
│   ├── Toast.tsx        # Win/lose notification component
│   └── mobile-swipe.tsx # Touch gesture handler
├── context/             # React Context providers
│   └── game-context.tsx # Game state management
├── pages/               # Page components
│   └── Home.tsx         # Game controls and restart
├── reducers/            # State management logic
│   └── game-logic-reducer.ts # Core game logic
├── styles/              # CSS styling files
├── types/               # TypeScript type definitions
│   ├── tile.ts          # Tile-related types
│   └── moveDirections.ts # Movement direction types
└── hooks/               # Custom React hooks
```

## 🔧 Component Architecture

### Core Components

#### **App.tsx**

- Root component that orchestrates the entire application
- Wraps components with `GameProvider` for state management
- Renders `ScoreBoard`, `Board`, and `Home` components

#### **Board.tsx**

- Main game board that handles:
  - Keyboard event listeners for arrow key controls
  - Touch/swipe gesture detection for mobile
  - Grid rendering and tile positioning
  - Game status display (win/lose toasts)
  - Dynamic board sizing based on selected dimensions

#### **ScoreBoard.tsx**

- Displays current game statistics:
  - **Win Score**: Target score (2048)
  - **Current Score**: Player's current score
- Updates in real-time as tiles merge

#### **Home.tsx**

- Game control interface:
  - **Restart Button**: Resets current game
  - **Board Size Selection**: 3×3, 4×4, 5×5, 6×6 options
  - **Default Button**: Quick reset to 4×4 board

#### **mobile-swipe.tsx**

- Custom touch gesture detection component
- Handles `touchstart` and `touchend` events
- Calculates swipe direction based on touch delta
- Prevents default touch behaviors for game area

#### **Toast.tsx**

- Notification component for game status
- Shows "You won!" or "You lost!" messages
- Appears as overlay on the game board

### State Management

#### **GameContext**

Centralized state management using React Context and useReducer:

**State Properties:**

- `score`: Current player score
- `status`: Game status ('ongoing', 'won', 'lost')
- `boardSize`: Current board dimensions (3-6)
- `board`: 2D array representing tile positions
- `tiles`: Object map of all tiles by ID
- `tilesByIds`: Array of tile IDs for rendering order
- `hasChanged`: Flag for triggering animations and new tile generation

**Key Functions:**

- `moveTiles(direction)`: Handles tile movement and merging
- `startGame(size)`: Initializes new game with specified board size
- `getTiles()`: Returns array of current tiles for rendering
- `appendRandomTile()`: Adds new tile (2 or 4) to random empty cell
- `checkGameState()`: Evaluates win/lose conditions

#### **Game Logic Reducer**

Handles all game state transitions:

**Actions:**

- `init_game`: Initialize new game with board size
- `create_tile`: Add new tile to board
- `move_up/down/left/right`: Handle directional movements
- `clean_up`: Remove merged tiles and update positions
- `update_status`: Change game status (won/lost)

**Core Logic:**

- **Tile Movement**: Slides tiles in specified direction until collision
- **Tile Merging**: Combines tiles with same values
- **Score Calculation**: Adds merged tile values to score
- **Board Updates**: Maintains 2D board state and tile positions
- **Animation Coordination**: Manages timing for smooth transitions

### Game Mechanics

#### **Tile Generation**

- New tiles spawn after each valid move
- 90% chance of generating a "2" tile
- 10% chance of generating a "4" tile
- Tiles appear in random empty positions

#### **Movement Algorithm**

1. **Slide Phase**: Move all tiles in direction until they hit obstacle
2. **Merge Phase**: Combine adjacent tiles with same values
3. **Cleanup Phase**: Remove merged tiles and update positions
4. **Generation Phase**: Add new tile if board changed

#### **Win/Lose Detection**

- **Win Condition**: Any tile reaches 2048 value OR score reaches 2048
- **Lose Condition**: Board is full AND no valid moves remain
- **Valid Move Check**: Looks for empty cells or mergeable adjacent tiles

#### **Animation System**

- **Move Animation**: 200ms duration for tile sliding
- **Merge Animation**: 100ms duration for tile combining
- **Throttling**: Prevents rapid input during animations
- **Timing Coordination**: Ensures proper sequence of move → merge → cleanup → generate

### Responsive Design

#### **Desktop Experience**

- Container width: 464px
- Keyboard controls with arrow keys
- Hover effects on buttons
- Optimized for mouse interaction

#### **Mobile Experience**

- Container width: 288px
- Touch/swipe gesture controls
- Responsive grid scaling
- Touch-friendly button sizes
- Prevents default touch behaviors

### Performance Optimizations

- **Throttled Input**: Prevents excessive move commands during animations
- **Efficient Rendering**: Uses tile IDs for React key optimization
- **Minimal Re-renders**: Context value memoization
- **CSS Grid**: Hardware-accelerated tile positioning
- **Lodash Utilities**: Optimized helper functions for array/object operations

## 🎨 Styling Architecture

### CSS Organization

- **Component-specific styles**: Each component has its own CSS file
- **CSS Variables**: Consistent theming and easy customization
- **CSS Grid**: Modern layout for responsive tile positioning
- **Animations**: Smooth transitions for tile movements and merges
- **Mobile-first**: Responsive design principles

### Key Style Features

- **Dynamic Grid**: Board size affects CSS grid template
- **Tile Animations**: Smooth sliding and merging effects
- **Color Coding**: Different colors for different tile values
- **Responsive Typography**: Scales with board size
- **Touch Optimization**: Larger touch targets for mobile

## 🔧 Configuration

### Game Constants (`contant.ts`)

- `gameWinTileValue`: 2048 (target tile value)
- `mergeAnimationDuration`: 100ms
- `moveAnimationDuration`: 200ms
- `containerWidthMobile`: 288px
- `containerWidthDesktop`: 464px

### Customization Options

- **Board Sizes**: 3×3, 4×4, 5×5, 6×6
- **Win Condition**: Configurable target value
- **Animation Timing**: Adjustable durations
- **Tile Values**: Customizable starting tile probabilities

## 🐛 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Development Features

- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type safety and IntelliSense
- **ESLint**: Code quality and consistency
- **Vite**: Fast build tool with optimized development experience

## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Touch Support**: Full touch and gesture support for mobile devices
- **Keyboard Support**: Arrow key navigation for desktop

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 Project

This project is an assignment from Exponent Energy Pvt Ltd

---

**Enjoy playing 2048!** 🎮
