'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DifficultySelector } from '@/components/difficulty-selector';
import { MazeCanvas } from '@/components/maze-canvas';
import { LanguageSwitcher } from '@/components/language-switcher';
import { generateMaze, type DifficultyLevel, type MazeResult } from '@/lib/maze-generator';

/**
 * Home Page - Maze Generator Application
 * 
 * Main application page that allows users to:
 * - Select difficulty level
 * - Generate mazes
 * - View generated mazes
 * - Print mazes
 * - Switch between English and Polish languages
 */
export default function Home() {
  const t = useTranslations('home');
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
          <div className="flex justify-center items-center gap-4 mb-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              {t('title')}
            </h1>
            <LanguageSwitcher />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1 no-print">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.title')}</CardTitle>
                <CardDescription>
                  {t('settings.description')}
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
                    {isGenerating ? t('buttons.generating') : t('buttons.generate')}
                  </Button>

                  {mazeResult && (
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      {t('buttons.print')}
                    </Button>
                  )}
                </div>

                <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
                  <p className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                    {t('legend.start')}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                    {t('legend.end')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maze Display Area */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="no-print">
                <CardTitle>{t('display.title')}</CardTitle>
                <CardDescription>
                  {mazeResult
                    ? t('display.ready')
                    : t('display.prompt')}
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
                        {t('display.noMaze')}
                      </p>
                      <p className="text-sm text-muted-foreground max-w-md">
                        {t('display.instructions')}
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
            {t('footer')}
          </p>
        </footer>
      </div>
    </div>
  );
}
