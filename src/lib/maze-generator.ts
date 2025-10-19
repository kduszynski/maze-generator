/**
 * Maze Generation using Recursive Backtracker Algorithm
 * 
 * This implements a depth-first search (DFS) based maze generation algorithm
 * that creates perfect mazes (exactly one path between any two points).
 */

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  row: number;
  col: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
}

export type Maze = Cell[][];

export interface MazeResult {
  maze: Maze;
  start: Position;
  end: Position;
}

/**
 * Maps difficulty levels to grid dimensions
 */
export const DIFFICULTY_DIMENSIONS: Record<DifficultyLevel, number> = {
  1: 10,  // Very Easy
  2: 15,  // Easy
  3: 25,  // Medium
  4: 40,  // Hard
  5: 60,  // Very Hard
};

/**
 * Initialize a grid with all walls closed
 */
function initializeGrid(size: number): Maze {
  const grid: Maze = [];
  
  for (let row = 0; row < size; row++) {
    grid[row] = [];
    for (let col = 0; col < size; col++) {
      grid[row][col] = {
        row,
        col,
        walls: {
          top: true,
          right: true,
          bottom: true,
          left: true,
        },
        visited: false,
      };
    }
  }
  
  return grid;
}

/**
 * Get unvisited neighbors of a cell
 */
function getUnvisitedNeighbors(cell: Cell, grid: Maze): Cell[] {
  const neighbors: Cell[] = [];
  const { row, col } = cell;
  const size = grid.length;
  
  // Top neighbor
  if (row > 0 && !grid[row - 1][col].visited) {
    neighbors.push(grid[row - 1][col]);
  }
  
  // Right neighbor
  if (col < size - 1 && !grid[row][col + 1].visited) {
    neighbors.push(grid[row][col + 1]);
  }
  
  // Bottom neighbor
  if (row < size - 1 && !grid[row + 1][col].visited) {
    neighbors.push(grid[row + 1][col]);
  }
  
  // Left neighbor
  if (col > 0 && !grid[row][col - 1].visited) {
    neighbors.push(grid[row][col - 1]);
  }
  
  return neighbors;
}

/**
 * Remove wall between two adjacent cells
 */
function removeWall(current: Cell, next: Cell): void {
  const rowDiff = current.row - next.row;
  const colDiff = current.col - next.col;
  
  // Next cell is above current
  if (rowDiff === 1) {
    current.walls.top = false;
    next.walls.bottom = false;
  }
  // Next cell is below current
  else if (rowDiff === -1) {
    current.walls.bottom = false;
    next.walls.top = false;
  }
  // Next cell is to the left
  else if (colDiff === 1) {
    current.walls.left = false;
    next.walls.right = false;
  }
  // Next cell is to the right
  else if (colDiff === -1) {
    current.walls.right = false;
    next.walls.left = false;
  }
}

/**
 * Recursive Backtracker algorithm implementation
 * Uses depth-first search with backtracking
 */
function generateMazeRecursive(grid: Maze, current: Cell): void {
  current.visited = true;
  
  // Get all unvisited neighbors
  const neighbors = getUnvisitedNeighbors(current, grid);
  
  // Shuffle neighbors for randomness
  for (let i = neighbors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
  }
  
  // Visit each unvisited neighbor
  for (const neighbor of neighbors) {
    if (!neighbor.visited) {
      removeWall(current, neighbor);
      generateMazeRecursive(grid, neighbor);
    }
  }
}

/**
 * Generate random start and end positions on opposite edges
 */
function generateStartEndPositions(size: number): { start: Position; end: Position } {
  // Randomly choose which edges to use: 0 = top/bottom, 1 = left/right
  const edgeType = Math.floor(Math.random() * 2);
  
  if (edgeType === 0) {
    // Top and bottom edges
    const startCol = Math.floor(Math.random() * size);
    const endCol = Math.floor(Math.random() * size);
    
    return {
      start: { row: 0, col: startCol },
      end: { row: size - 1, col: endCol },
    };
  } else {
    // Left and right edges
    const startRow = Math.floor(Math.random() * size);
    const endRow = Math.floor(Math.random() * size);
    
    return {
      start: { row: startRow, col: 0 },
      end: { row: endRow, col: size - 1 },
    };
  }
}

/**
 * Generate a complete maze for the given difficulty level
 * 
 * @param difficulty - Difficulty level (1-5)
 * @returns MazeResult containing the generated maze and start/end positions
 */
export function generateMaze(difficulty: DifficultyLevel): MazeResult {
  const size = DIFFICULTY_DIMENSIONS[difficulty];
  const grid = initializeGrid(size);
  
  // Start from a random cell
  const startRow = Math.floor(Math.random() * size);
  const startCol = Math.floor(Math.random() * size);
  const startCell = grid[startRow][startCol];
  
  // Generate the maze using recursive backtracker
  generateMazeRecursive(grid, startCell);
  
  // Generate start and end positions on opposite edges
  const { start, end } = generateStartEndPositions(size);
  
  // Open the entrance and exit by removing the outer wall
  const startCell_final = grid[start.row][start.col];
  const endCell = grid[end.row][end.col];
  
  // Remove outer wall at start position
  if (start.row === 0) {
    startCell_final.walls.top = false;
  } else if (start.row === size - 1) {
    startCell_final.walls.bottom = false;
  } else if (start.col === 0) {
    startCell_final.walls.left = false;
  } else if (start.col === size - 1) {
    startCell_final.walls.right = false;
  }
  
  // Remove outer wall at end position
  if (end.row === 0) {
    endCell.walls.top = false;
  } else if (end.row === size - 1) {
    endCell.walls.bottom = false;
  } else if (end.col === 0) {
    endCell.walls.left = false;
  } else if (end.col === size - 1) {
    endCell.walls.right = false;
  }
  
  return {
    maze: grid,
    start,
    end,
  };
}


