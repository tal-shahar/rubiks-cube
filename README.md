# Rubik's Cube - Three.js & React

An interactive 3D Rubik's Cube built with Three.js and React, featuring realistic cube mechanics, proper scramble algorithms, and smooth animations.

## Features

- 🎯 **3D Interactive Cube**: Fully rendered 3D Rubik's Cube using WebGL
- 🎮 **Interactive Controls**: Orbit controls for manual rotation and exploration
- ⚡ **Auto Rotation**: Smooth automatic rotation with toggle control
- 🎨 **Modern UI**: Beautiful gradient background with glassmorphism effects
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎪 **Smooth Animations**: Fluid transitions and hover effects
- 🔄 **Realistic Scramble**: Proper Rubik's cube notation and mechanics
- 🧩 **Cube Mechanics**: Center pieces are fixed, proper face rotations
- 📊 **Scramble Display**: Shows current scramble sequence and status

## Technologies Used

- **React 18** - Modern React with hooks
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber
- **Styled Components** - CSS-in-JS styling
- **WebGL** - Hardware-accelerated 3D rendering

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rubiks-cube
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── RubiksCube.js    # Main 3D cube component with state management
│   ├── Controls.js      # UI controls component
│   └── InfoPanel.js     # Information display component
├── App.js               # Main application component
├── index.js            # React entry point
└── index.css           # Global styles
```

## Controls

- **Mouse/Touch**: Drag to rotate the cube manually
- **Scroll**: Zoom in/out
- **Auto Rotate**: Toggle automatic rotation
- **Manual Rotate**: Toggle manual rotation mode
- **Reset**: Reset cube to solved state
- **Scramble**: Randomly scramble the cube using proper notation
- **Solve**: Automatically solve the cube

## Cube Mechanics

### Physical Constraints
- **Center Pieces**: Fixed in place and never move (as in a real Rubik's cube)
- **Edge Pieces**: Have 2 colors and move between edge positions
- **Corner Pieces**: Have 3 colors and move between corner positions
- **Face Rotations**: Each face (F, B, R, L, U, D) rotates independently

### Scramble Algorithm
- Uses standard Rubik's cube notation (F, B, R, L, U, D)
- Avoids redundant moves (same face twice in a row)
- Generates 20 random moves for a proper scramble
- Smooth animations between each move
- Visual feedback showing scramble progress

### Face Notation
- **F**: Front face (white)
- **B**: Back face (yellow)
- **R**: Right face (red)
- **L**: Left face (orange)
- **U**: Up face (blue)
- **D**: Down face (green)

## Features in Detail

### 3D Cube Structure
- 27 individual cube pieces (3x3x3)
- Each piece has 6 faces with proper colors
- Realistic materials and lighting
- Smooth animations and transitions
- Proper state management for cube positions

### Interactive Controls
- Orbit controls for camera manipulation
- Toggle buttons for different rotation modes
- Action buttons for cube manipulation
- Responsive design for all screen sizes
- Real-time scramble status display

### Visual Design
- Gradient background with modern aesthetics
- Glassmorphism UI elements
- Smooth hover animations
- Professional color scheme
- Information panel with cube mechanics

## Future Enhancements

- [ ] Complete Rubik's Cube solving algorithms
- [ ] Move notation and history tracking
- [ ] Timer and statistics
- [ ] Multiple cube sizes (2x2, 4x4, etc.)
- [ ] Custom color schemes
- [ ] Save/load cube states
- [ ] Multiplayer support
- [ ] Advanced solving techniques display

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Three.js community for the excellent 3D library
- React Three Fiber for seamless React integration
- The Rubik's Cube community for inspiration 