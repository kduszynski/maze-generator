'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';

/**
 * LanguageSwitcher Component
 * 
 * Displays flag buttons to switch between English and Polish languages.
 * Uses Unicode flag emojis for a clean, simple interface.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: 'en' | 'pl') => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant={locale === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleLanguageChange('en')}
        disabled={isPending}
        className="font-medium text-2xl px-3 py-2 h-auto"
        title="English"
        aria-label="Switch to English"
      >
        🇬🇧
      </Button>
      <Button
        variant={locale === 'pl' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleLanguageChange('pl')}
        disabled={isPending}
        className="font-medium text-2xl px-3 py-2 h-auto"
        title="Polski"
        aria-label="Przełącz na Polski"
      >
        🇵🇱
      </Button>
    </div>
  );
}

