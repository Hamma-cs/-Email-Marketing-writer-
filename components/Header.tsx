import React from 'react';
import { SparklesIcon, SettingsIcon } from './icons/Icons';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
    onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
    const { t } = useLanguage();

    return (
        <header className="bg-white dark:bg-dark-surface shadow-sm border-b border-accent dark:border-dark-border">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg">
                        <SparklesIcon className="h-6 w-6 text-white"/>
                    </div>
                    <h1 className="text-2xl font-bold text-primary-dark dark:text-dark-primary-text">{t('appTitle')}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                    <button
                        onClick={onOpenSettings}
                        className="p-2 rounded-full text-primary-dark dark:text-light hover:bg-accent/50 dark:hover:bg-primary"
                        aria-label={t('settings')}
                    >
                        <SettingsIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>
      </header>
    )
}