// Color utilities for Rubik's Cube

// Function to get the original solved position for a piece based on its pieceId
export function getOriginalPosition(pieceId) {
  const positions = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        positions.push([x, y, z]);
      }
    }
  }
  
  return positions[pieceId];
}

// Function to get the original solved colors for a piece based on its pieceId
export function getOriginalColors(pieceId) {
  // Map pieceId to original solved position
  const positions = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        positions.push([x, y, z]);
      }
    }
  }
  
  const originalPosition = positions[pieceId];
  const [x, y, z] = originalPosition;
  
  // Handle S layer pieces (z=0) FIRST - middle layer between front and back
  if (z === 0) {
    // S layer pieces need UNIQUE colors based on their position
    // Each S layer piece should have different colors to make rotations work correctly
    let colors = {
      front: 'white',      // Front face color
      back: 'yellow',      // Back face color  
      right: 'red',        // Right face color
      left: 'orange',      // Left face color
      top: 'blue',         // Top face color
      bottom: 'green'      // Bottom face color
    };
    
    // Make S layer pieces have UNIQUE colors based on their position
    // Use ONLY standard Rubik's Cube colors: white, yellow, red, orange, blue, green
    if (x === -1) {
      colors.left = 'orange';
      // For left side pieces, make other colors different using standard colors
      if (y === -1) {
        colors.bottom = 'green';
        colors.right = 'red';     // Standard color for uniqueness
        colors.top = 'blue';      // Standard color for uniqueness
      } else if (y === 0) {
        colors.right = 'red';     // Standard color for uniqueness
        colors.top = 'blue';      // Standard color for uniqueness
        colors.bottom = 'green';  // Standard color for uniqueness
      } else if (y === 1) {
        colors.top = 'blue';
        colors.right = 'red';     // Standard color for uniqueness
        colors.bottom = 'green';  // Standard color for uniqueness
      }
    } else if (x === 0) {
      // For center pieces, make colors unique based on y position using standard colors
      if (y === -1) {
        colors.bottom = 'green';
        colors.left = 'orange';   // Standard color for uniqueness
        colors.right = 'red';     // Standard color for uniqueness
        colors.top = 'blue';      // Standard color for uniqueness
      } else if (y === 1) {
        colors.top = 'blue';
        colors.left = 'orange';   // Standard color for uniqueness
        colors.right = 'red';     // Standard color for uniqueness
        colors.bottom = 'green';  // Standard color for uniqueness
      }
    } else if (x === 1) {
      colors.right = 'red';
      // For right side pieces, make other colors different using standard colors
      if (y === -1) {
        colors.bottom = 'green';
        colors.left = 'orange';   // Standard color for uniqueness
        colors.top = 'blue';      // Standard color for uniqueness
      } else if (y === 0) {
        colors.left = 'orange';   // Standard color for uniqueness
        colors.top = 'blue';      // Standard color for uniqueness
        colors.bottom = 'green';  // Standard color for uniqueness
      } else if (y === 1) {
        colors.top = 'blue';
        colors.left = 'orange';   // Standard color for uniqueness
        colors.bottom = 'green';  // Standard color for uniqueness
      }
    }
    
    return colors; // Return early for S layer pieces
  }
  
  // Assign colors based on the piece's ORIGINAL SOLVED position (determined by pieceId)
  // ALL faces get proper colors, not just the visible ones
  let colors = {
    front: 'white',      // Front face color
    back: 'yellow',      // Back face color  
    right: 'red',        // Right face color
    left: 'orange',      // Left face color
    top: 'blue',         // Top face color
    bottom: 'green'      // Bottom face color
  };
  
  // For pieces on the surface, some faces will be hidden and should be dark gray
  // But for pieces in the interior, all faces should have proper colors
  if (x === -1) {
    // Left face pieces - left face is orange, but other faces depend on position
    colors.left = 'orange';
    if (y === -1) colors.bottom = 'green';
    if (y === 1) colors.top = 'blue';
    if (z === -1) colors.back = 'yellow';
    if (z === 1) colors.front = 'white';
  }
  if (x === 1) {
    // Right face pieces - right face is red, but other faces depend on position
    colors.right = 'red';
    if (y === -1) colors.bottom = 'green';
    if (y === 1) colors.top = 'blue';
    if (z === -1) colors.back = 'yellow';
    if (z === 1) colors.front = 'white';
  }
  if (y === -1) {
    // Bottom face pieces - bottom face is green, but other faces depend on position
    colors.bottom = 'green';
    if (x === -1) colors.left = 'orange';
    if (x === 1) colors.right = 'red';
    if (z === -1) colors.back = 'yellow';
    if (z === 1) colors.front = 'white';
  }
  if (y === 1) {
    // Top face pieces - top face is blue, but other faces depend on position
    colors.top = 'blue';
    if (x === -1) colors.left = 'orange';
    if (x === 1) colors.right = 'red';
    if (z === -1) colors.back = 'yellow';
    if (z === 1) colors.front = 'white';
  }
  if (z === -1) {
    // Back face pieces - back face is yellow, but other faces depend on position
    colors.back = 'yellow';
    if (x === -1) colors.left = 'orange';
    if (x === 1) colors.right = 'red';
    if (y === -1) colors.bottom = 'green';
    if (y === 1) colors.top = 'blue';
  }
  if (z === 1) {
    // Front face pieces - front face is white, but other faces depend on position
    colors.front = 'white';
    if (x === -1) colors.left = 'orange';
    if (x === 1) colors.right = 'red';
    if (y === -1) colors.bottom = 'green';
    if (y === 1) colors.top = 'blue';
  }
  
  return colors;
}

// Function to get starting position colors for a piece (saved when cube is initialized)
export function getStartingPositionColors(pieceId) {
  // This function returns the colors that should be visible when the piece is in its starting position
  // These colors will move with the piece and always be positioned outward-facing
  const positions = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        positions.push([x, y, z]);
      }
    }
  }
  
  const startingPosition = positions[pieceId];
  const [x, y, z] = startingPosition;
  
  // Store the colors that this piece should have (these move with the piece)
  // These are the "starting colors" that will always be positioned outward-facing
  const startingColors = {
    front: null,
    back: null,
    right: null,
    left: null,
    top: null,
    bottom: null
  };
  
  // Assign the starting colors based on the piece's original position
  if (x === -1) startingColors.left = 'orange';   // Left face pieces
  if (x === 1) startingColors.right = 'red';      // Right face pieces
  if (y === -1) startingColors.bottom = 'green';  // Bottom face pieces
  if (y === 1) startingColors.top = 'blue';       // Top face pieces
  if (z === -1) startingColors.back = 'yellow';   // Back face pieces
  if (z === 1) startingColors.front = 'white';    // Front face pieces
  
  return {
    position: startingPosition,
    visibleColors: startingColors
  };
}

// Function to ensure starting colors are outward-facing
export function ensureStartingColorsOutwardFacing(piece, currentPosition) {
  const [x, y, z] = currentPosition;
  
  // Get the starting colors for this piece (these move with the piece)
  const startingColors = piece.startingColors || getStartingPositionColors(piece.pieceId);
  
  // Create new color object with starting colors positioned outward
  const outwardColors = {
    front: 'white',      // Default colors
    back: 'yellow',      // Default colors
    right: 'red',        // Default colors
    left: 'orange',      // Default colors
    top: 'blue',         // Default colors
    bottom: 'green'      // Default colors
  };
  
  // Determine which faces should be visible based on current position
  const shouldBeVisible = {
    front: z === 1,
    back: z === -1,
    right: x === 1,
    left: x === -1,
    top: y === 1,
    bottom: y === -1
  };
  
  // Position the starting colors to face outward based on current position
  if (shouldBeVisible.front && startingColors.visibleColors.front) {
    outwardColors.front = startingColors.visibleColors.front;
  }
  if (shouldBeVisible.back && startingColors.visibleColors.back) {
    outwardColors.back = startingColors.visibleColors.back;
  }
  if (shouldBeVisible.right && startingColors.visibleColors.right) {
    outwardColors.right = startingColors.visibleColors.right;
  }
  if (shouldBeVisible.left && startingColors.visibleColors.left) {
    outwardColors.left = startingColors.visibleColors.left;
  }
  if (shouldBeVisible.top && startingColors.visibleColors.top) {
    outwardColors.top = startingColors.visibleColors.top;
  }
  if (shouldBeVisible.bottom && startingColors.visibleColors.bottom) {
    outwardColors.bottom = startingColors.visibleColors.bottom;
  }
  
  console.log(`🎨 Positioned starting colors outward for piece ${piece.pieceId} at [${x}, ${y}, ${z}]`);
  console.log(`🎨 Starting colors:`, JSON.stringify(startingColors.visibleColors));
  console.log(`🎨 Outward colors:`, JSON.stringify(outwardColors));
  
  return outwardColors;
}

// Function to get expected color for a face
export function getExpectedColorForFace(face) {
  const colorMap = {
    front: 'white',
    back: 'yellow',
    right: 'red',
    left: 'orange',
    top: 'blue',
    bottom: 'green'
  };
  
  return colorMap[face] || 'red';
}
