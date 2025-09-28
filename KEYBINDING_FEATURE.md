# Keybinding Customization Feature

## Overview

The Rubik's Cube application now includes a comprehensive keybinding customization system that allows users to:

- Map any key or key combination to cube face rotations
- Save their preferences in browser cookies
- Use both single keys and modifier key combinations
- Reset to default keybindings at any time

## Features

### 🎯 Custom Key Mappings
- Map any key to any face rotation (R, L, U, D, F, B, M, E, S)
- Support for both clockwise and counter-clockwise rotations
- Visual feedback for key conflicts

### ⌨️ Key Combination Support
- Single keys: `r`, `l`, `u`, `d`, `f`, `b`
- Modifier combinations: `Ctrl+R`, `Alt+Shift+F`, `Cmd+U`
- Supported modifiers: `Ctrl`, `Alt`, `Shift`, `Cmd` (Mac) / `Meta`

### 💾 Persistent Storage
- Keybindings saved in browser cookies
- Automatic permission request on first customization
- Settings persist between browser sessions

### 🔄 Easy Management
- One-click reset to default keybindings
- Real-time conflict detection
- Intuitive modal interface

## Usage

### Accessing Keybinding Settings

1. Click the **"⚙️ Customize Keys"** button in the Controls panel
2. **Cookie permission dialog will appear only for first-time users** (if no existing keybindings found)
3. A modal will open showing all available face rotations
4. Click on any key input field to start recording
5. Press your desired key or key combination
6. Click **"Save Keybindings"** to apply changes

### Default Keybindings

| Face | Clockwise | Counter-Clockwise |
|------|-----------|-------------------|
| R (Right) | `r` | `R` (Shift+R) |
| L (Left) | `l` | `L` (Shift+L) |
| U (Up) | `u` | `U` (Shift+U) |
| D (Down) | `d` | `D` (Shift+D) |
| F (Front) | `f` | `F` (Shift+F) |
| B (Back) | `b` | `B` (Shift+B) |
| M (Middle) | `m` | `M` (Shift+M) |
| E (Equatorial) | `e` | `E` (Shift+E) |
| S (Standing) | `s` | `S` (Shift+S) |

### Customizing Keybindings

1. **Single Keys**: Press any letter, number, or special key
2. **Key Combinations**: Hold modifier keys (Ctrl, Alt, Shift, Cmd) and press another key
3. **Special Keys**: Use `Space`, `Enter`, `Tab`, `Escape`, `Backspace`, `Delete`

### Examples

- `r` → Right face clockwise
- `Ctrl+R` → Right face clockwise (custom)
- `Alt+Shift+F` → Front face counter-clockwise (custom)
- `Space` → Any face rotation (custom)

## Technical Implementation

### Components

- **`KeybindingModal`**: Main customization interface
- **`useKeybindings`**: React hook for keybinding management
- **`keybindings.js`**: Utility functions for key handling and storage

### Cookie Storage

- **Cookie Name**: `rubiks-cube-keybindings`
- **Format**: JSON string with key-to-binding mappings
- **Expiration**: 1 year
- **Security**: SameSite=Lax for security

### Key Event Handling

- Uses `eventToKeyString()` to normalize key events
- Supports both `keydown` and `keyup` events
- Prevents default browser behavior for bound keys
- Handles modifier key combinations correctly

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Privacy & Permissions

- **Cookie Permission**: Requested only for first-time users (no existing keybindings)
- **Data Stored**: Only keybinding mappings (no personal data)
- **Local Storage**: All data stored locally in browser cookies
- **No Tracking**: No analytics or external data transmission

## Troubleshooting

### Keybindings Not Saving
- Check if browser allows cookies
- Ensure permission was granted when prompted
- Try refreshing the page after saving

### Keys Not Working
- Check for key conflicts in the customization modal
- Ensure the key is properly bound to a face rotation
- Try resetting to default keybindings

### Modal Not Opening
- Check browser console for JavaScript errors
- Ensure all dependencies are properly loaded
- Try refreshing the page

## Future Enhancements

- [ ] Import/Export keybinding profiles
- [ ] Multiple keybinding profiles per user
- [ ] Keyboard shortcuts for common actions
- [ ] Visual keybinding editor with drag-and-drop
- [ ] Keybinding presets for different user types
