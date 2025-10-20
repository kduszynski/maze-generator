'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { DifficultyLevel } from '@/lib/maze-generator';

interface DifficultySelectorProps {
  value: DifficultyLevel;
  onChange: (value: DifficultyLevel) => void;
}

interface DifficultyOption {
  level: DifficultyLevel;
  labelKey: string;
  descriptionKey: string;
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { level: 1, labelKey: 'difficulty.veryEasy', descriptionKey: 'difficulty.grid.veryEasy' },
  { level: 2, labelKey: 'difficulty.easy', descriptionKey: 'difficulty.grid.easy' },
  { level: 3, labelKey: 'difficulty.medium', descriptionKey: 'difficulty.grid.medium' },
  { level: 4, labelKey: 'difficulty.hard', descriptionKey: 'difficulty.grid.hard' },
  { level: 5, labelKey: 'difficulty.veryHard', descriptionKey: 'difficulty.grid.veryHard' },
];

/**
 * DifficultySelector Component
 * 
 * Allows users to select the maze difficulty level.
 * Each level corresponds to a different grid size.
 * Supports internationalization for English and Polish.
 */
export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  const t = useTranslations('home');

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">{t('difficulty.title')}</Label>
      <RadioGroup
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val) as DifficultyLevel)}
        className="space-y-2"
      >
        {DIFFICULTY_OPTIONS.map((option) => (
          <div
            key={option.level}
            className="flex items-center space-x-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <RadioGroupItem value={option.level.toString()} id={`difficulty-${option.level}`} />
            <Label
              htmlFor={`difficulty-${option.level}`}
              className="flex-1 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{t(option.labelKey)}</span>
                <span className="text-sm text-muted-foreground">{t(option.descriptionKey)}</span>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
