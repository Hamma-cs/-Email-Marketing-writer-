import React from 'react';
import type { EmailResult, EmailSection } from '../types';
import { SectionCard } from './SectionCard';
import { FinalReviewCard } from './FinalReviewCard';
import { useLanguage } from '../contexts/LanguageContext';

interface EmailOutputProps {
  emailResult: EmailResult;
  onImproveSection: (index: number, section: EmailSection) => void;
  isImproving: Record<number, boolean>;
}

export const EmailOutput: React.FC<EmailOutputProps> = ({ emailResult, onImproveSection, isImproving }) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark dark:text-dark-primary-text mb-4">{t('generatedEmailTitle')}</h2>
        <div className="space-y-4">
          {emailResult.sections.map((section, index) => (
            <SectionCard 
              key={index}
              section={section}
              onImprove={() => onImproveSection(index, section)}
              isImproving={isImproving[index] || false}
            />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-primary-dark dark:text-dark-primary-text my-6">{t('finalReviewTitle')}</h2>
        <FinalReviewCard finalReview={emailResult.final_review} />
      </div>
    </div>
  );
};