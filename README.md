# Rubik's Cube - Three.js & React

An interactive 3D Rubik's Cube built with Three.js and React, featuring realistic cube mechanics, proper scramble algorithms, and smooth animations.

## 🚀 Quick Start

```bash
git clone https://github.com/your-username/rubiks-cube.git
cd rubiks-cube
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

**🎮 Controls**: Drag to rotate • Scroll to zoom • Use keyboard shortcuts (R, L, U, D, F, B) • Click buttons for face rotations

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
- ⌨️ **Keyboard Controls**: Use keyboard shortcuts for face rotations
- 🎯 **Manual Face Rotation**: Individual face rotation controls
- 🔄 **Reset & Solve**: Reset to solved state or auto-solve functionality

## Technologies Used

- **React 18** - Modern React with hooks
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber
- **Styled Components** - CSS-in-JS styling
- **WebGL** - Hardware-accelerated 3D rendering
- **CRACO** - Create React App Configuration Override

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/rubiks-cube.git
cd rubiks-cube
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

4. **Open your browser and navigate to `http://localhost:3000`**

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run serve` - Serve production build locally
- `npm run dev` - Start with logging server (for debugging)
- `npm run deploy` - Deploy to production

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Project Structure

```
src/
├── components/
│   ├── cube/                    # Modular cube implementation
│   │   ├── components/          # Cube-specific components
│   │   │   ├── CubeGroup.js     # Group of cube pieces
│   │   │   └── CubePiece.js     # Individual cube piece
│   │   ├── hooks/               # Custom hooks
│   │   │   └── useRotation.js   # Rotation logic hook
│   │   ├── state/               # State management
│   │   │   └── CubeStateProvider.js # Cube state context
│   │   ├── utils/               # Utility functions
│   │   │   ├── colors.js        # Color definitions
│   │   │   ├── logger.js        # Logging utilities
│   │   │   └── shapes.js        # 3D shape definitions
│   │   ├── __tests__/           # Test files
│   │   ├── RubiksCube.js        # Main modular cube component
│   │   └── index.js             # Cube module exports
│   ├── RubiksCube.js            # Main 3D cube wrapper component
│   ├── Controls.js              # UI controls component
│   └── InfoPanel.js             # Information display component
├── App.js                       # Main application component
├── index.js                     # React entry point
└── index.css                    # Global styles
```

## Complete Functionality Guide

### 🎮 Interactive Controls

#### Mouse/Touch Controls
- **Drag**: Rotate the cube manually around its center
- **Scroll**: Zoom in/out to get closer or further from the cube
- **Right-click + Drag**: Pan the view (if enabled)

#### Keyboard Shortcuts
- **R** - Rotate Right face clockwise
- **Shift + R** - Rotate Right face counter-clockwise
- **L** - Rotate Left face clockwise
- **Shift + L** - Rotate Left face counter-clockwise
- **U** - Rotate Up face clockwise
- **Shift + U** - Rotate Up face counter-clockwise
- **D** - Rotate Down face clockwise
- **Shift + D** - Rotate Down face counter-clockwise
- **F** - Rotate Front face clockwise
- **Shift + F** - Rotate Front face counter-clockwise
- **B** - Rotate Back face clockwise
- **Shift + B** - Rotate Back face counter-clockwise

### 🎛️ Control Panel Features

#### Toggle Controls
- **Auto Rotate**: Continuously rotates the cube automatically
- **Manual Rotate**: Enables manual rotation mode for precise control

#### Face Rotation Buttons
- **Clockwise Rotations**: R, F, B, L, U, D buttons for clockwise face rotations
- **Counter-Clockwise Rotations**: R', F', B', L', U', D' buttons for counter-clockwise rotations
- **Color-coded Buttons**: Each face button is color-coded to match the cube's face colors

#### Action Buttons
- **Reset**: Returns the cube to its solved state and resets camera position
- **Scramble**: Generates a random scramble sequence using proper Rubik's cube notation
- **Solve**: Automatically solves the cube (when implemented)

### 📊 Information Panel

#### Real-time Display
- **Current Scramble**: Shows the current scramble sequence being applied
- **Scramble Status**: Displays "Scrambling..." during scramble operations
- **Cube Statistics**: Shows cube dimensions, piece count, and combinations

#### Educational Content
- **Cube Mechanics**: Explains how center pieces are fixed and edge/corner pieces move
- **Control Instructions**: Lists all available mouse, keyboard, and button controls
- **Face Notation**: Explains the standard Rubik's cube notation system

## Cube Mechanics

### Physical Constraints
- **Center Pieces**: Fixed in place and never move (as in a real Rubik's cube)
- **Edge Pieces**: Have 2 colors and move between edge positions
- **Corner Pieces**: Have 3 colors and move between corner positions
- **Face Rotations**: Each face (F, B, R, L, U, D) rotates independently

### Scramble Algorithm
- Uses standard Rubik's cube notation (F, B, R, L, U, D)
- Generates 20 completely random moves
- Includes both clockwise and counter-clockwise rotations
- Smooth animations between each move
- Visual feedback showing scramble progress

### Face Notation
- **F**: Front face (white)
- **B**: Back face (yellow)
- **R**: Right face (red)
- **L**: Left face (orange)
- **U**: Up face (blue)
- **D**: Down face (green)

## Usage Guide

### Getting Started
1. **Launch the application** by running `npm start`
2. **Navigate to `http://localhost:3000`** in your browser
3. **Explore the cube** by dragging to rotate, scrolling to zoom
4. **Try the controls** using the buttons or keyboard shortcuts
5. **Scramble the cube** to see the scrambling animation
6. **Reset the cube** to return to solved state

### Step-by-Step Tutorial
1. **Basic Navigation**: Drag the mouse to rotate the cube view
2. **Zoom Control**: Use mouse scroll to zoom in/out
3. **Face Rotation**: Click the colored face buttons or use keyboard shortcuts
4. **Auto Rotation**: Toggle the "Auto Rotate" button to see continuous rotation
5. **Scrambling**: Click "Scramble" to see a random scramble sequence
6. **Reset**: Click "Reset" to return to the solved state

## Features in Detail

### 3D Cube Structure
- **27 individual cube pieces** (3x3x3) with realistic geometry
- **Proper color mapping** with authentic Rubik's cube colors
- **Realistic materials and lighting** using Three.js materials
- **Smooth animations** with proper easing and timing
- **State management** for accurate cube position tracking
- **Modular architecture** for maintainable code structure

### Interactive Controls
- **Orbit controls** for intuitive camera manipulation
- **Toggle buttons** for different rotation modes (auto/manual)
- **Color-coded face buttons** matching cube face colors
- **Keyboard shortcuts** for quick face rotations
- **Responsive design** that works on all screen sizes
- **Real-time status display** showing current operations

### Visual Design
- **Gradient background** with modern purple-blue gradient
- **Glassmorphism UI elements** with backdrop blur effects
- **Smooth hover animations** and button transitions
- **Professional color scheme** with proper contrast
- **Information panel** with educational content
- **Loading states** for better user feedback

### Technical Implementation
- **React Three Fiber** for seamless Three.js integration
- **Context-based state management** for cube state
- **Custom hooks** for rotation logic and animations
- **Modular component architecture** for maintainability
- **Comprehensive testing** with Jest and React Testing Library
- **WebGL optimization** for smooth 3D rendering

## Troubleshooting

### Common Issues

#### Application Won't Start
- **Check Node.js version**: Ensure you have Node.js 14 or higher
- **Clear node_modules**: Delete `node_modules` folder and run `npm install`
- **Check port availability**: Make sure port 3000 is not in use

#### Performance Issues
- **Update graphics drivers**: Ensure your graphics drivers are up to date
- **Close other applications**: Free up system resources
- **Check browser compatibility**: Use a modern browser with WebGL support

#### Controls Not Working
- **Check focus**: Make sure the browser window is focused for keyboard shortcuts
- **Try different browsers**: Some browsers may have different WebGL implementations
- **Disable browser extensions**: Some extensions may interfere with WebGL

### Browser Compatibility
- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile browsers**: Limited support (touch controls work)

## Future Enhancements

### Planned Features
- [ ] **Complete solving algorithms** with step-by-step solutions
- [ ] **Move notation and history** tracking with undo/redo
- [ ] **Timer and statistics** for speedcubing practice
- [ ] **Multiple cube sizes** (2x2, 4x4, 5x5, etc.)
- [ ] **Custom color schemes** and themes
- [ ] **Save/load cube states** with localStorage
- [ ] **Multiplayer support** for collaborative solving
- [ ] **Advanced solving techniques** display and tutorials
- [ ] **VR support** for immersive experience
- [ ] **Sound effects** for better user feedback

### Technical Improvements
- [ ] **Performance optimization** for better frame rates
- [ ] **Mobile touch gestures** for better mobile experience
- [ ] **Accessibility improvements** for screen readers
- [ ] **Internationalization** support for multiple languages
- [ ] **PWA support** for offline usage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Acknowledgments

- **Three.js community** for the excellent 3D graphics library
- **React Three Fiber** for seamless React integration with Three.js
- **React Three Drei** for useful helpers and components
- **The Rubik's Cube community** for inspiration and notation standards
- **WebGL community** for hardware-accelerated 3D rendering
- **React community** for the modern component-based architecture

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ using React, Three.js, and WebGL** 