/**
 * Kociemba's Two-Phase Algorithm Implementation
 * 
 * This is a simplified implementation of Kociemba's algorithm for solving Rubik's Cube.
 * The algorithm works in two phases:
 * Phase 1: Solve to G1 subgroup (edges oriented correctly)
 * Phase 2: Solve from G1 to solved state
 */

// Cube face constants
const FACES = {
  UP: 'U', DOWN: 'D', FRONT: 'F', BACK: 'B', LEFT: 'L', RIGHT: 'R'
};

// Move types
const MOVES = {
  CLOCKWISE: '',
  COUNTERCLOCKWISE: "'",
  DOUBLE: '2'
};

// Color constants for cube representation
const COLORS = {
  WHITE: 0, YELLOW: 1, RED: 2, ORANGE: 3, BLUE: 4, GREEN: 5
};

/**
 * Cube State Representation
 * 
 * The cube is represented as arrays for corners and edges:
 * - Corners: 8 positions with orientation (0-2)
 * - Edges: 12 positions with orientation (0-1)
 */
class CubeState {
  constructor() {
    // Initialize solved state
    this.corners = Array.from({ length: 8 }, (_, i) => ({ position: i, orientation: 0 }));
    this.edges = Array.from({ length: 12 }, (_, i) => ({ position: i, orientation: 0 }));
  }

  /**
   * Apply a move to the cube state
   */
  applyMove(face, direction = '') {
    const moves = this.generateMoveSequence(face, direction);
    moves.forEach(move => this.executeMove(move));
  }

  /**
   * Generate move sequence for a face turn
   */
  generateMoveSequence(face, direction) {
    const sequence = [];
    
    switch (direction) {
      case "'":
        sequence.push(`${face}'`);
        break;
      case '2':
        sequence.push(`${face}2`);
        break;
      default:
        sequence.push(face);
    }
    
    return sequence;
  }

  /**
   * Execute a single move on the cube state
   */
  executeMove(move) {
    // This is a simplified move execution
    // In a full implementation, this would update corner and edge positions/orientations
    
    // For now, we'll use a lookup table approach
    const moveMap = this.getMoveMapping(move);
    
    // Apply corner moves
    const newCorners = [...this.corners];
    moveMap.corners.forEach(({ from, to, orientationChange }) => {
      newCorners[to] = {
        position: this.corners[from].position,
        orientation: (this.corners[from].orientation + orientationChange) % 3
      };
    });
    this.corners = newCorners;

    // Apply edge moves
    const newEdges = [...this.edges];
    moveMap.edges.forEach(({ from, to, orientationChange }) => {
      newEdges[to] = {
        position: this.edges[from].position,
        orientation: (this.edges[from].orientation + orientationChange) % 2
      };
    });
    this.edges = newEdges;
  }

  /**
   * Get move mapping for a specific move
   */
  getMoveMapping(move) {
    // Simplified move mappings - in a full implementation, these would be complete
    const moveMappings = {
      'R': {
        corners: [
          { from: 1, to: 2, orientationChange: 2 },
          { from: 2, to: 6, orientationChange: 1 },
          { from: 6, to: 5, orientationChange: 2 },
          { from: 5, to: 1, orientationChange: 1 }
        ],
        edges: [
          { from: 1, to: 6, orientationChange: 0 },
          { from: 6, to: 9, orientationChange: 0 },
          { from: 9, to: 4, orientationChange: 0 },
          { from: 4, to: 1, orientationChange: 0 }
        ]
      },
      'U': {
        corners: [
          { from: 0, to: 1, orientationChange: 0 },
          { from: 1, to: 2, orientationChange: 0 },
          { from: 2, to: 3, orientationChange: 0 },
          { from: 3, to: 0, orientationChange: 0 }
        ],
        edges: [
          { from: 0, to: 1, orientationChange: 0 },
          { from: 1, to: 2, orientationChange: 0 },
          { from: 2, to: 3, orientationChange: 0 },
          { from: 3, to: 0, orientationChange: 0 }
        ]
      }
      // Add more move mappings as needed
    };

    return moveMappings[move] || { corners: [], edges: [] };
  }

  /**
   * Check if cube is in G1 subgroup (edges oriented correctly)
   */
  isInG1() {
    // In G1, all edges should be oriented correctly (orientation = 0)
    return this.edges.every(edge => edge.orientation === 0);
  }

  /**
   * Check if cube is solved
   */
  isSolved() {
    // Check if all pieces are in their correct positions and orientations
    const cornersSolved = this.corners.every((corner, index) => 
      corner.position === index && corner.orientation === 0
    );
    const edgesSolved = this.edges.every((edge, index) => 
      edge.position === index && edge.orientation === 0
    );
    
    return cornersSolved && edgesSolved;
  }

  /**
   * Get a scramble sequence
   */
  scramble(length = 30) {
    const faces = Object.values(FACES);
    const directions = ['', "'", '2'];
    const moves = [];
    
    let lastFace = '';
    
    for (let i = 0; i < length; i++) {
      let face;
      do {
        face = faces[Math.floor(Math.random() * faces.length)];
      } while (face === lastFace); // Avoid consecutive moves on same face
      
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const move = face + direction;
      
      this.applyMove(face, direction);
      moves.push(move);
      lastFace = face;
    }
    
    return moves;
  }
}

/**
 * Kociemba's Two-Phase Algorithm Solver
 */
class KociembaSolver {
  constructor() {
    this.maxDepth = 12; // Maximum search depth
    this.solution = [];
    this.nodes = 0;
  }

  /**
   * Solve the cube using Kociemba's algorithm
   */
  solve(cubeState) {
    this.solution = [];
    this.nodes = 0;
    
    console.log('🧩 Starting Kociemba solver...');
    
    // Phase 1: Solve to G1 subgroup
    const phase1Solution = this.solvePhase1(cubeState);
    if (!phase1Solution) {
      console.log('❌ Phase 1 failed');
      return null;
    }
    
    console.log(`✅ Phase 1 completed: ${phase1Solution.length} moves`);
    
    // Apply Phase 1 moves to get to G1
    const g1Cube = this.applySolution(cubeState, phase1Solution);
    
    // Phase 2: Solve from G1 to solved
    const phase2Solution = this.solvePhase2(g1Cube);
    if (!phase2Solution) {
      console.log('❌ Phase 2 failed');
      return null;
    }
    
    console.log(`✅ Phase 2 completed: ${phase2Solution.length} moves`);
    
    // Combine solutions
    const totalSolution = [...phase1Solution, ...phase2Solution];
    console.log(`🎯 Total solution: ${totalSolution.length} moves`);
    console.log(`🔍 Nodes searched: ${this.nodes}`);
    
    return totalSolution;
  }

  /**
   * Phase 1: Solve to G1 subgroup (edges oriented correctly)
   */
  solvePhase1(cubeState) {
    console.log('🔄 Starting Phase 1...');
    
    // Use iterative deepening search
    for (let depth = 1; depth <= this.maxDepth; depth++) {
      console.log(`🔍 Searching at depth ${depth}...`);
      
      const result = this.searchPhase1(cubeState, depth, []);
      if (result) {
        return result;
      }
    }
    
    return null;
  }

  /**
   * Phase 2: Solve from G1 to solved state
   */
  solvePhase2(cubeState) {
    console.log('🔄 Starting Phase 2...');
    
    // Use iterative deepening search
    for (let depth = 1; depth <= this.maxDepth; depth++) {
      console.log(`🔍 Searching at depth ${depth}...`);
      
      const result = this.searchPhase2(cubeState, depth, []);
      if (result) {
        return result;
      }
    }
    
    return null;
  }

  /**
   * Search for Phase 1 solution using DFS
   */
  searchPhase1(cubeState, depth, moves) {
    this.nodes++;
    
    if (depth === 0) {
      return cubeState.isInG1() ? moves : null;
    }
    
    // Try all possible moves
    const allMoves = this.getPhase1Moves();
    
    for (const move of allMoves) {
      // Skip if same face as last move
      if (moves.length > 0 && this.getFace(move) === this.getFace(moves[moves.length - 1])) {
        continue;
      }
      
      const newCube = this.copyCube(cubeState);
      newCube.applyMove(this.getFace(move), this.getDirection(move));
      
      const result = this.searchPhase1(newCube, depth - 1, [...moves, move]);
      if (result) {
        return result;
      }
    }
    
    return null;
  }

  /**
   * Search for Phase 2 solution using DFS
   */
  searchPhase2(cubeState, depth, moves) {
    this.nodes++;
    
    if (depth === 0) {
      return cubeState.isSolved() ? moves : null;
    }
    
    // Try all possible moves (limited set for Phase 2)
    const allMoves = this.getPhase2Moves();
    
    for (const move of allMoves) {
      // Skip if same face as last move
      if (moves.length > 0 && this.getFace(move) === this.getFace(moves[moves.length - 1])) {
        continue;
      }
      
      const newCube = this.copyCube(cubeState);
      newCube.applyMove(this.getFace(move), this.getDirection(move));
      
      const result = this.searchPhase2(newCube, depth - 1, [...moves, move]);
      if (result) {
        return result;
      }
    }
    
    return null;
  }

  /**
   * Get all possible moves for Phase 1
   */
  getPhase1Moves() {
    const faces = Object.values(FACES);
    const directions = ['', "'", '2'];
    const moves = [];
    
    faces.forEach(face => {
      directions.forEach(direction => {
        moves.push(face + direction);
      });
    });
    
    return moves;
  }

  /**
   * Get moves allowed in Phase 2 (G1 subgroup moves)
   */
  getPhase2Moves() {
    // In Phase 2, we can only use moves that preserve G1
    // This includes U, D, F2, B2, R2, L2
    return ['U', "U'", 'U2', 'D', "D'", 'D2', 'F2', 'B2', 'R2', 'L2'];
  }

  /**
   * Apply a solution to a cube state
   */
  applySolution(cubeState, solution) {
    const newCube = this.copyCube(cubeState);
    
    solution.forEach(move => {
      newCube.applyMove(this.getFace(move), this.getDirection(move));
    });
    
    return newCube;
  }

  /**
   * Copy a cube state
   */
  copyCube(cubeState) {
    const newCube = new CubeState();
    newCube.corners = cubeState.corners.map(corner => ({ ...corner }));
    newCube.edges = cubeState.edges.map(edge => ({ ...edge }));
    return newCube;
  }

  /**
   * Extract face from move notation
   */
  getFace(move) {
    return move[0];
  }

  /**
   * Extract direction from move notation
   */
  getDirection(move) {
    if (move.endsWith("'")) return "'";
    if (move.endsWith('2')) return '2';
    return '';
  }
}

/**
 * Main solver interface
 */
export class AdvancedSolver {
  constructor() {
    this.kociembaSolver = new KociembaSolver();
    this.cubeState = new CubeState();
  }

  /**
   * Solve a scrambled cube
   */
  solve() {
    console.log('🎯 Advanced Solver: Starting solve...');
    
    const startTime = Date.now();
    const solution = this.kociembaSolver.solve(this.cubeState);
    const endTime = Date.now();
    
    if (solution) {
      console.log(`✅ Solution found in ${endTime - startTime}ms`);
      console.log(`📝 Solution: ${solution.join(' ')}`);
      return {
        success: true,
        solution: solution,
        moves: solution.length,
        time: endTime - startTime,
        nodes: this.kociembaSolver.nodes
      };
    } else {
      console.log('❌ No solution found');
      return {
        success: false,
        solution: null,
        moves: 0,
        time: endTime - startTime,
        nodes: this.kociembaSolver.nodes
      };
    }
  }

  /**
   * Scramble the cube
   */
  scramble(length = 30) {
    console.log(`🔀 Scrambling cube with ${length} moves...`);
    const scramble = this.cubeState.scramble(length);
    console.log(`📝 Scramble: ${scramble.join(' ')}`);
    return scramble;
  }

  /**
   * Analyze cube complexity
   */
  analyzeComplexity() {
    // Simple complexity analysis based on cube state
    const cornerComplexity = this.cubeState.corners.reduce((sum, corner, index) => {
      return sum + (corner.position !== index ? 1 : 0) + corner.orientation;
    }, 0);
    
    const edgeComplexity = this.cubeState.edges.reduce((sum, edge, index) => {
      return sum + (edge.position !== index ? 1 : 0) + edge.orientation;
    }, 0);
    
    const totalComplexity = cornerComplexity + edgeComplexity;
    
    let difficulty;
    if (totalComplexity < 10) difficulty = 'Easy';
    else if (totalComplexity < 20) difficulty = 'Medium';
    else if (totalComplexity < 30) difficulty = 'Hard';
    else difficulty = 'Very Hard';
    
    return {
      cornerComplexity,
      edgeComplexity,
      totalComplexity,
      difficulty
    };
  }

  /**
   * Check if cube is solved
   */
  isSolved() {
    return this.cubeState.isSolved();
  }

  /**
   * Reset cube to solved state
   */
  reset() {
    this.cubeState = new CubeState();
    console.log('🔄 Cube reset to solved state');
  }
}

// Export the main solver class
export default AdvancedSolver;
