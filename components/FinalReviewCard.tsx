import React from 'react';
import type { FinalReview } from '../types';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface FinalReviewCardProps {
    finalReview: FinalReview;
}

const reviewKeys: (keyof FinalReview)[] = [
    'mobile_preview', 'links_checked', 'grammar_verified', 'spam_score_ok'
];

export const FinalReviewCard: React.FC<FinalReviewCardProps> = ({ finalReview }) => {
    const { t, dir } = useLanguage();
    return (
        <div className="bg-white dark:bg-dark-surface shadow-sm rounded-lg overflow-hidden">
            <div className="p-5">
                <ul className="space-y-3">
                    {reviewKeys.map(key => {
                        const value = finalReview[key] as boolean;
                        return (
                            <li key={key} className="flex items-center">
                                {value ? (
                                    <CheckCircleIcon className="h-6 w-6 text-emerald-500" />
                                ) : (
                                    <XCircleIcon className="h-6 w-6 text-rose-500" />
                                )}
                                <span className={`text-md ${dir === 'ltr' ? 'ml-3' : 'mr-3'} ${value ? 'text-primary dark:text-dark-secondary-text' : 'text-rose-700 dark:text-rose-300'}`}>{t(`finalReviewItems.${key}`)}</span>
                            </li>
                        );
                    })}
                </ul>
                {finalReview.error && (
                    <p className="mt-4 text-sm text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-900/30 p-3 rounded-md">Error: {finalReview.error}</p>
                )}
            </div>
            <div className="px-5 py-4 border-t border-accent dark:border-dark-border bg-light/50 dark:bg-dark-bg/50">
                 <div className="flex items-center">
                    <ClockIcon className="h-6 w-6 text-primary dark:text-light" />
                    <div className={dir === 'ltr' ? 'ml-3' : 'mr-3'}>
                        <p className="text-sm font-medium text-primary/80 dark:text-dark-secondary-text">{t('suggestedSendTime')}</p>
                        <p className="text-md font-semibold text-primary-dark dark:text-dark-primary-text">{finalReview.send_time_suggested}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};