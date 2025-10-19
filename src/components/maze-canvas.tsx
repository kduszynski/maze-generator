'use client';

import { useEffect, useRef } from 'react';
import type { Maze, Position } from '@/lib/maze-generator';

interface MazeCanvasProps {
  maze: Maze;
  start: Position;
  end: Position;
}

/**
 * MazeCanvas Component
 * 
 * Renders a maze using HTML5 Canvas for efficient drawing.
 * Displays walls in black, paths in white, and marks start/end points
 * with colored circles (green for start, red for end).
 */
export function MazeCanvas({ maze, start, end }: MazeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const size = maze.length;
    const cellSize = 20; // Size of each cell in pixels
    const wallThickness = 2;
    
    // Set canvas dimensions
    const canvasSize = size * cellSize;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    
    // Clear canvas with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    // Draw maze walls
    ctx.strokeStyle = 'black';
    ctx.lineWidth = wallThickness;
    ctx.lineCap = 'square';
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = maze[row][col];
        const x = col * cellSize;
        const y = row * cellSize;
        
        ctx.beginPath();
        
        // Draw top wall
        if (cell.walls.top) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellSize, y);
        }
        
        // Draw right wall
        if (cell.walls.right) {
          ctx.moveTo(x + cellSize, y);
          ctx.lineTo(x + cellSize, y + cellSize);
        }
        
        // Draw bottom wall
        if (cell.walls.bottom) {
          ctx.moveTo(x, y + cellSize);
          ctx.lineTo(x + cellSize, y + cellSize);
        }
        
        // Draw left wall
        if (cell.walls.left) {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + cellSize);
        }
        
        ctx.stroke();
      }
    }
    
    // Draw start marker (green circle)
    const startX = start.col * cellSize + cellSize / 2;
    const startY = start.row * cellSize + cellSize / 2;
    const markerRadius = cellSize * 0.35;
    
    ctx.fillStyle = '#22c55e'; // Green color
    ctx.beginPath();
    ctx.arc(startX, startY, markerRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw end marker (red circle)
    const endX = end.col * cellSize + cellSize / 2;
    const endY = end.row * cellSize + cellSize / 2;
    
    ctx.fillStyle = '#ef4444'; // Red color
    ctx.beginPath();
    ctx.arc(endX, endY, markerRadius, 0, Math.PI * 2);
    ctx.fill();
    
  }, [maze, start, end]);
  
  return (
    <div className="flex justify-center items-center p-4 maze-print-area">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 shadow-lg max-w-full h-auto"
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  );
}


