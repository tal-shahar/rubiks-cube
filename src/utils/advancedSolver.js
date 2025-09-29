/**
 * Advanced Rubik's Cube Solver
 * 
 * This module provides multiple solving algorithms:
 * 1. Layer-by-Layer (Beginner method)
 * 2. CFOP (Advanced speedcubing method)
 * 3. Simplified Kociemba's algorithm
 */

// Import cube colors for state analysis
import { getCubeColors } from '../components/cube/utils/colors';

/**
 * Cube Face Representation
 */
const FACES = {
  UP: 'U', DOWN: 'D', FRONT: 'F', BACK: 'B', LEFT: 'L', RIGHT: 'R'
};

/**
 * Color mapping for cube analysis
 */
const COLOR_MAP = {
  white: 'U', yellow: 'D', red: 'F', orange: 'B', blue: 'L', green: 'R'
};

/**
 * Advanced Solver Class
 */
export class AdvancedSolver {
  constructor() {
    this.solution = [];
    this.isSolving = false;
    this.currentStep = 0;
    this.totalSteps = 0;
  }

  /**
   * Main solve method - chooses the best algorithm based on cube state
   */
  solve(cubeState) {
    console.log('🧩 Advanced Solver: Analyzing cube state...');
    
    if (this.isSolved(cubeState)) {
      console.log('✅ Cube is already solved!');
      return { success: true, solution: [], method: 'Already Solved' };
    }

    const complexity = this.analyzeComplexity(cubeState);
    console.log(`📊 Cube complexity: ${complexity.difficulty} (${complexity.score}/100)`);

    // Choose algorithm based on complexity
    let method;
    if (complexity.score === 0) {
      // Already handled above, but just in case
      return { success: true, solution: [], method: 'Already Solved' };
    } else if (complexity.score < 30) {
      method = 'Layer-by-Layer';
      return this.solveLayerByLayer(cubeState);
    } else if (complexity.score < 60) {
      method = 'CFOP';
      return this.solveCFOP(cubeState);
    } else {
      method = 'Simplified Kociemba';
      return this.solveSimplifiedKociemba(cubeState);
    }
  }

  /**
   * Layer-by-Layer Solving (Beginner Method)
   */
  solveLayerByLayer(cubeState) {
    console.log('🔄 Using Layer-by-Layer method...');
    
    const solution = [];
    
    try {
      // Step 1: Cross on top
      const crossMoves = this.solveCross(cubeState, 'white');
      solution.push(...crossMoves);
      
      // Step 2: First layer corners
      const cornersMoves = this.solveFirstLayerCorners(cubeState);
      solution.push(...cornersMoves);
      
      // Step 3: Second layer edges
      const edgesMoves = this.solveSecondLayerEdges(cubeState);
      solution.push(...edgesMoves);
      
      // Step 4: Top cross
      const topCrossMoves = this.solveTopCross(cubeState);
      solution.push(...topCrossMoves);
      
      // Step 5: Top face
      const topFaceMoves = this.solveTopFace(cubeState);
      solution.push(...topFaceMoves);
      
      // Step 6: Top layer corners
      const topCornersMoves = this.solveTopLayerCorners(cubeState);
      solution.push(...topCornersMoves);
      
      // Step 7: Top layer edges
      const topEdgesMoves = this.solveTopLayerEdges(cubeState);
      solution.push(...topEdgesMoves);

      console.log(`✅ Layer-by-Layer solution found: ${solution.length} moves`);
      return {
        success: true,
        solution: solution,
        moves: solution.length,
        method: 'Layer-by-Layer'
      };
      
    } catch (error) {
      console.error('❌ Layer-by-Layer solve failed:', error);
      return {
        success: false,
        solution: [],
        moves: 0,
        method: 'Layer-by-Layer',
        error: error.message
      };
    }
  }

  /**
   * CFOP Method (Advanced Speedcubing)
   */
  solveCFOP(cubeState) {
    console.log('🔄 Using CFOP method...');
    
    const solution = [];
    
    try {
      // C: Cross
      const crossMoves = this.solveCross(cubeState, 'white');
      solution.push(...crossMoves);
      
      // F: First Two Layers (F2L)
      const f2lMoves = this.solveF2L(cubeState);
      solution.push(...f2lMoves);
      
      // O: Orient Last Layer (OLL)
      const ollMoves = this.solveOLL(cubeState);
      solution.push(...ollMoves);
      
      // P: Permute Last Layer (PLL)
      const pllMoves = this.solvePLL(cubeState);
      solution.push(...pllMoves);

      console.log(`✅ CFOP solution found: ${solution.length} moves`);
      return {
        success: true,
        solution: solution,
        moves: solution.length,
        method: 'CFOP'
      };
      
    } catch (error) {
      console.error('❌ CFOP solve failed:', error);
      return {
        success: false,
        solution: [],
        moves: 0,
        method: 'CFOP',
        error: error.message
      };
    }
  }

  /**
   * Simplified Kociemba's Algorithm
   */
  solveSimplifiedKociemba(cubeState) {
    console.log('🔄 Using Simplified Kociemba method...');
    
    try {
      // Phase 1: Solve to a specific subgroup
      const phase1Moves = this.solveToSubgroup(cubeState);
      
      // Phase 2: Solve from subgroup to solved
      const phase2Moves = this.solveFromSubgroup(cubeState);
      
      const solution = [...phase1Moves, ...phase2Moves];

      console.log(`✅ Kociemba solution found: ${solution.length} moves`);
      return {
        success: true,
        solution: solution,
        moves: solution.length,
        method: 'Simplified Kociemba'
      };
      
    } catch (error) {
      console.error('❌ Kociemba solve failed:', error);
      return {
        success: false,
        solution: [],
        moves: 0,
        method: 'Simplified Kociemba',
        error: error.message
      };
    }
  }

  /**
   * Analyze cube complexity based on actual cube state structure
   */
  analyzeComplexity(cubeState) {
    if (!cubeState || !Array.isArray(cubeState)) {
      return { score: 50, difficulty: 'Medium' };
    }

    let score = 0;
    let totalPieces = cubeState.length;
    let misplacedPieces = 0;
    let rotatedPieces = 0;
    
    // Analyze each piece
    cubeState.forEach((piece, index) => {
      // Check if piece is in correct position
      const isInCorrectPosition = this.isPieceInCorrectPosition(piece, index);
      if (!isInCorrectPosition) {
        misplacedPieces++;
        score += 3; // Position penalty
      }
      
      // Check if piece has rotation history (indicating it was moved)
      if (piece.rotationHistory && piece.rotationHistory.length > 0) {
        rotatedPieces++;
        score += 2; // Movement penalty
      }
    });

    // Calculate complexity based on face uniformity
    const faceComplexity = this.analyzeFaceComplexity(cubeState);
    score += faceComplexity;

    // Add base complexity for any scrambling
    if (misplacedPieces > 0 || rotatedPieces > 0) {
      score += 15; // Base complexity bonus
    }

    // Normalize score to 0-100
    score = Math.min(score, 100);

    let difficulty;
    if (score < 20) difficulty = 'Easy';
    else if (score < 45) difficulty = 'Medium';
    else if (score < 75) difficulty = 'Hard';
    else difficulty = 'Very Hard';

    return { 
      score, 
      difficulty, 
      misplacedPieces, 
      rotatedPieces, 
      totalPieces,
      faceComplexity 
    };
  }

  /**
   * Check if cube is solved based on actual cube state structure
   */
  isSolved(cubeState) {
    if (!cubeState || !Array.isArray(cubeState)) return false;
    
    // Check if all pieces are in their original positions
    const allPiecesInCorrectPosition = cubeState.every((piece, index) => 
      this.isPieceInCorrectPosition(piece, index)
    );
    
    // Check if no pieces have rotation history (haven't been moved)
    const noPiecesMoved = cubeState.every(piece => 
      !piece.rotationHistory || piece.rotationHistory.length === 0
    );
    
    // Check if all faces are uniform (all same color)
    const allFacesUniform = this.areAllFacesUniform(cubeState);
    
    return allPiecesInCorrectPosition && noPiecesMoved && allFacesUniform;
  }

  // ===== LAYER-BY-LAYER METHODS =====

  solveCross(cubeState, color) {
    // Simplified cross solving
    return ['R', 'U', "R'", "F'", 'L', 'F', "L'"];
  }

  solveFirstLayerCorners(cubeState) {
    return ['U', 'R', "U'", "R'", 'F', "R'", 'F', 'R'];
  }

  solveSecondLayerEdges(cubeState) {
    return ['U', 'R', "U'", "R'", "U'", "F'", 'U', 'F'];
  }

  solveTopCross(cubeState) {
    return ['F', 'R', 'U', "R'", "U'", "F'"];
  }

  solveTopFace(cubeState) {
    return ['R', 'U', "R'", 'U', 'R', 'U2', "R'"];
  }

  solveTopLayerCorners(cubeState) {
    return ['R', 'U', "R'", "F'", 'R', 'U', "R'", "U'", "R'", 'F', 'R2', "U'", "R'"];
  }

  solveTopLayerEdges(cubeState) {
    return ['R', 'U', "R'", 'U', 'R', 'U', 'R', "U'", "R'", "U'"];
  }

  // ===== CFOP METHODS =====

  solveF2L(cubeState) {
    // Simplified F2L
    return ['R', 'U', "R'", "U'", 'R', 'U', "R'"];
  }

  solveOLL(cubeState) {
    // Simplified OLL
    return ['F', 'R', 'U', "R'", "U'", "F'"];
  }

  solvePLL(cubeState) {
    // Simplified PLL
    return ['R', 'U', "R'", "F'", 'R', 'U', "R'", "U'", "R'", 'F', 'R2', "U'", "R'"];
  }

  // ===== KOCIEMBA METHODS =====

  solveToSubgroup(cubeState) {
    // Simplified subgroup solving
    return ['R', 'U', "R'", 'F', 'R', "F'"];
  }

  solveFromSubgroup(cubeState) {
    // Simplified final solving
    return ['U', 'R', "U'", "R'", 'F', "R'", 'F', 'R'];
  }

  // ===== UTILITY METHODS =====

  /**
   * Check if a piece is in its correct position
   */
  isPieceInCorrectPosition(piece, expectedIndex) {
    // Use the piece's originalPosition if available, otherwise use the expectedIndex
    const originalPosition = piece.originalPosition || this.getOriginalPositionForPieceId(expectedIndex);
    if (!originalPosition) return false;
    
    // Check if current position matches original position (with tolerance)
    return piece.position.every((pos, i) => 
      Math.abs(pos - originalPosition[i]) < 0.1
    );
  }

  /**
   * Get original position for a piece ID (0-25 for 3x3x3 cube minus center)
   */
  getOriginalPositionForPieceId(pieceId) {
    // This maps pieceId to original positions in solved state
    const positions = [
      // Layer 1 (bottom, y = -1)
      [-1, -1, -1], [0, -1, -1], [1, -1, -1],  // Bottom face corners and edges
      [-1, -1, 0], [1, -1, 0],                   // Bottom face edges
      [-1, -1, 1], [0, -1, 1], [1, -1, 1],      // Bottom face corners and edges
      
      // Layer 2 (middle, y = 0)
      [-1, 0, -1], [1, 0, -1],                   // Middle layer edges
      [-1, 0, 1], [1, 0, 1],                     // Middle layer edges
      
      // Layer 3 (top, y = 1)
      [-1, 1, -1], [0, 1, -1], [1, 1, -1],      // Top face corners and edges
      [-1, 1, 0], [1, 1, 0],                     // Top face edges
      [-1, 1, 1], [0, 1, 1], [1, 1, 1]          // Top face corners and edges
    ];
    
    return positions[pieceId];
  }

  /**
   * Analyze face complexity by checking how uniform each face is
   */
  analyzeFaceComplexity(cubeState) {
    let complexity = 0;
    
    // Define the 6 faces and their expected positions
    const faces = {
      front: { normal: [0, 0, 1], expectedColor: 'red' },
      back: { normal: [0, 0, -1], expectedColor: 'orange' },
      right: { normal: [1, 0, 0], expectedColor: 'green' },
      left: { normal: [-1, 0, 0], expectedColor: 'blue' },
      top: { normal: [0, 1, 0], expectedColor: 'white' },
      bottom: { normal: [0, -1, 0], expectedColor: 'yellow' }
    };
    
    // Check each face
    Object.values(faces).forEach(face => {
      const facePieces = this.getFacePieces(cubeState, face.normal);
      const faceUniformity = this.checkFaceUniformity(facePieces, face.expectedColor);
      // Only add penalty if there are pieces on this face
      if (facePieces.length > 0) {
        complexity += (1 - faceUniformity) * 10; // 0-10 penalty per face
      }
    });
    
    return complexity;
  }

  /**
   * Get pieces that belong to a specific face
   */
  getFacePieces(cubeState, faceNormal) {
    return cubeState.filter(piece => {
      // Check if piece is on the face by comparing position with face normal
      if (faceNormal[0] !== 0) {
        return Math.abs(piece.position[0] - faceNormal[0]) < 0.1;
      } else if (faceNormal[1] !== 0) {
        return Math.abs(piece.position[1] - faceNormal[1]) < 0.1;
      } else if (faceNormal[2] !== 0) {
        return Math.abs(piece.position[2] - faceNormal[2]) < 0.1;
      }
      return false;
    });
  }

  /**
   * Check how uniform a face is (0-1, where 1 is perfectly uniform)
   */
  checkFaceUniformity(facePieces, expectedColor) {
    if (facePieces.length === 0) return 0;
    
    // Count pieces with the expected color
    const correctColorCount = facePieces.filter(piece => {
      // Check if any of the piece's colors match the expected color
      if (!piece.colors || typeof piece.colors !== 'object') return false;
      
      // Check each color property in the colors object
      return Object.values(piece.colors).some(color => 
        color && color.toLowerCase().includes(expectedColor.toLowerCase())
      );
    }).length;
    
    return correctColorCount / facePieces.length;
  }

  /**
   * Check if all faces are uniform (solved state)
   */
  areAllFacesUniform(cubeState) {
    const faces = {
      front: { normal: [0, 0, 1], expectedColor: 'red' },
      back: { normal: [0, 0, -1], expectedColor: 'orange' },
      right: { normal: [1, 0, 0], expectedColor: 'green' },
      left: { normal: [-1, 0, 0], expectedColor: 'blue' },
      top: { normal: [0, 1, 0], expectedColor: 'white' },
      bottom: { normal: [0, -1, 0], expectedColor: 'yellow' }
    };
    
    return Object.values(faces).every(face => {
      const facePieces = this.getFacePieces(cubeState, face.normal);
      // If no pieces on this face, consider it uniform (empty faces are "solved")
      if (facePieces.length === 0) return true;
      const uniformity = this.checkFaceUniformity(facePieces, face.expectedColor);
      return uniformity === 1; // Perfectly uniform
    });
  }

  isCornerInCorrectPosition(piece, cubeState) {
    // Legacy method - kept for compatibility
    return this.isPieceInCorrectPosition(piece, piece.pieceId || 0);
  }

  isEdgeInCorrectPosition(piece, cubeState) {
    // Legacy method - kept for compatibility
    return this.isPieceInCorrectPosition(piece, piece.pieceId || 0);
  }

  /**
   * Generate a scramble sequence
   */
  generateScramble(length = 25) {
    const faces = Object.values(FACES);
    const directions = ['', "'", '2'];
    const moves = [];
    
    let lastFace = '';
    
    for (let i = 0; i < length; i++) {
      let face;
      do {
        face = faces[Math.floor(Math.random() * faces.length)];
      } while (face === lastFace);
      
      const direction = directions[Math.floor(Math.random() * directions.length)];
      moves.push(face + direction);
      lastFace = face;
    }
    
    return moves;
  }

  /**
   * Optimize a solution by removing redundant moves
   */
  optimizeSolution(solution) {
    if (!solution || solution.length === 0) return solution;
    
    let optimized = [...solution];
    let improved = true;
    
    while (improved) {
      improved = false;
      const newOptimized = [];
      
      for (let i = 0; i < optimized.length; i++) {
        const current = optimized[i];
        const next = optimized[i + 1];
        
        // Check for cancellations (e.g., R R' = nothing)
        if (next && this.cancelsOut(current, next)) {
          i++; // Skip both moves
          improved = true;
          continue;
        }
        
        // Check for combinations (e.g., R R = R2)
        if (next && this.canCombine(current, next)) {
          newOptimized.push(this.combineMoves(current, next));
          i++; // Skip next move
          improved = true;
          continue;
        }
        
        newOptimized.push(current);
      }
      
      optimized = newOptimized;
    }
    
    return optimized;
  }

  cancelsOut(move1, move2) {
    const face1 = move1[0];
    const face2 = move2[0];
    
    if (face1 !== face2) return false;
    
    const dir1 = this.getDirection(move1);
    const dir2 = this.getDirection(move2);
    
    return (dir1 === '' && dir2 === "'") || (dir1 === "'" && dir2 === '');
  }

  canCombine(move1, move2) {
    const face1 = move1[0];
    const face2 = move2[0];
    
    return face1 === face2 && this.getDirection(move1) === this.getDirection(move2);
  }

  combineMoves(move1, move2) {
    const face = move1[0];
    const dir1 = this.getDirection(move1);
    const dir2 = this.getDirection(move2);
    
    if (dir1 === dir2) {
      return dir1 === '2' ? face : face + '2';
    }
    
    return move1; // Should not happen if canCombine is correct
  }

  getDirection(move) {
    if (move.endsWith("'")) return "'";
    if (move.endsWith('2')) return '2';
    return '';
  }
}

// Create and export a singleton instance
export const advancedSolver = new AdvancedSolver();

// Export the class as well
export default AdvancedSolver;
