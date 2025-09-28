# Mouse Rotation Feature

## Overview
The Rubik's Cube now supports intuitive mouse-based rotation! You can grab and drag the cube to rotate it in 3D space.

## How to Use

### Basic Mouse Rotation
1. **Enable Mouse Rotation**: Make sure the "Mouse Rotation" toggle in the controls is set to "ON"
2. **Grab and Drag**: 
   - Move your mouse over the cube
   - Click and hold the left mouse button
   - Drag to rotate the cube in 3D space
   - Release to stop rotating

### Controls
- **Mouse Rotation Toggle**: Turn mouse rotation on/off
- **Auto Rotate**: When enabled, disables mouse rotation (cube rotates automatically)
- **Manual Rotate**: Legacy rotation mode (now disabled by default)

### Interaction Modes
- **Mouse Rotation ON**: Click and drag to rotate the cube
- **Mouse Rotation OFF**: Use face rotation buttons and keyboard shortcuts only
- **Auto Rotate ON**: Cube rotates automatically, mouse rotation disabled
- **Animating**: Mouse rotation disabled during face rotations

### Visual Feedback
- **Grab Cursor**: Shows when hovering over the cube (mouse rotation enabled)
- **Grabbing Cursor**: Shows when actively dragging
- **Default Cursor**: Shows when mouse rotation is disabled

### Technical Details
- Uses React Three Fiber's pointer events
- Smooth 3D rotation with Euler angles
- Responsive to mouse movement with configurable sensitivity
- Automatically disables during animations to prevent conflicts

## Keyboard Shortcuts
You can still use keyboard shortcuts for face rotations:
- `R`, `L`, `U`, `D`, `F`, `B` - Rotate faces clockwise
- `Shift + R`, `Shift + L`, etc. - Rotate faces counter-clockwise

## Troubleshooting
- If mouse rotation isn't working, check that "Mouse Rotation" is enabled
- Make sure "Auto Rotate" is disabled
- Try refreshing the page if the cursor doesn't change
- Face rotation buttons and keyboard shortcuts always work regardless of mouse rotation settings
