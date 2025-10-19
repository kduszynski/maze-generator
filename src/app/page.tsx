'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DifficultySelector } from '@/components/difficulty-selector';
import { MazeCanvas } from '@/components/maze-canvas';
import { generateMaze, type DifficultyLevel, type MazeResult } from '@/lib/maze-generator';

/**
 * Home Page - Maze Generator Application
 * 
 * Main application page that allows users to:
 * - Select difficulty level
 * - Generate mazes
 * - View generated mazes
 * - Print mazes
 */
export default function Home() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(2); // Default: Easy
  const [mazeResult, setMazeResult] = useState<MazeResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Handle maze generation
   * Creates a new maze based on the selected difficulty level
   */
  const handleGenerateMaze = () => {
    setIsGenerating(true);
    
    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(() => {
      const result = generateMaze(difficulty);
      setMazeResult(result);
      setIsGenerating(false);
    }, 50);
  };

  /**
   * Handle print functionality
   * Opens the browser's print dialog
   */
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 no-print">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
            Maze Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate perfect mazes with adjustable difficulty levels. Each maze has exactly one solution path from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1 no-print">
            <Card>
              <CardHeader>
                <CardTitle>Maze Settings</CardTitle>
                <CardDescription>
                  Configure your maze parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <DifficultySelector
                  value={difficulty}
                  onChange={setDifficulty}
                />

                <div className="space-y-3">
                  <Button
                    onClick={handleGenerateMaze}
                    disabled={isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Maze'}
                  </Button>

                  {mazeResult && (
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Print Maze
                    </Button>
                  )}
                </div>

                <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
                  <p className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                    Green circle = Start
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                    Red circle = End
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maze Display Area */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="no-print">
                <CardTitle>Generated Maze</CardTitle>
                <CardDescription>
                  {mazeResult
                    ? 'Your maze is ready! You can print it using the Print button.'
                    : 'Select a difficulty level and click Generate to create your maze.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mazeResult ? (
                  <div className="flex justify-center">
                    <MazeCanvas
                      maze={mazeResult.maze}
                      start={mazeResult.start}
                      end={mazeResult.end}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[400px] text-center">
                    <div className="space-y-4">
                      <div className="text-6xl">🧩</div>
                      <p className="text-muted-foreground text-lg">
                        No maze generated yet
                      </p>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Choose your difficulty level and click the Generate button to create a new maze puzzle.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-muted-foreground no-print">
          <p>
            duszynki.dev
          </p>
        </footer>
      </div>
    </div>
  );
}
