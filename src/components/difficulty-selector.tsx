'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { DifficultyLevel } from '@/lib/maze-generator';

interface DifficultySelectorProps {
  value: DifficultyLevel;
  onChange: (value: DifficultyLevel) => void;
}

interface DifficultyOption {
  level: DifficultyLevel;
  label: string;
  description: string;
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { level: 1, label: 'Very Easy', description: '10×10 grid' },
  { level: 2, label: 'Easy', description: '15×15 grid' },
  { level: 3, label: 'Medium', description: '25×25 grid' },
  { level: 4, label: 'Hard', description: '40×40 grid' },
  { level: 5, label: 'Very Hard', description: '60×60 grid' },
];

/**
 * DifficultySelector Component
 * 
 * Allows users to select the maze difficulty level.
 * Each level corresponds to a different grid size.
 */
export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Difficulty Level</Label>
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
                <span className="font-medium">{option.label}</span>
                <span className="text-sm text-muted-foreground">{option.description}</span>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}


