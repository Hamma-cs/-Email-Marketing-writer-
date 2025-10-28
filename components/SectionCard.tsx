import React from 'react';
import type { EmailSection } from '../types';
import { CheckCircleIcon, SparklesIcon, XCircleIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface SectionCardProps {
  section: EmailSection;
  onImprove: () => void;
  isImproving: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({ section, onImprove, isImproving }) => {
  const { t, dir } = useLanguage();
  const [sectionName, sectionCriterion] = section.name.split('(');
  
  const checklistItems = section.checklist || [];
  const areAllCriteriaMet = checklistItems.length > 0 && checklistItems.every(item => item.met);

  return (
    <div className="bg-white dark:bg-dark-surface shadow-sm rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-primary-dark dark:text-dark-primary-text">{sectionName.trim()}</h3>
            {sectionCriterion && <p className="text-sm text-primary/80 dark:text-dark-secondary-text mt-1">({sectionCriterion}</p>}
          </div>
          <button
            onClick={onImprove}
            disabled={isImproving}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary/80 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-accent disabled:cursor-not-allowed"
          >
             {isImproving ? (
               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
                <SparklesIcon className="h-4 w-4" />
            )}
            <span className={dir === 'ltr' ? 'ml-2' : 'mr-2'}>{t('improveButton')}</span>
          </button>
        </div>
        <div className="mt-4 prose prose-sm max-w-none text-primary dark:text-dark-secondary-text whitespace-pre-wrap">{section.content}</div>
        {section.error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">Error: {section.error}</p>}
      </div>
      <div className={`px-5 py-3 border-t border-accent dark:border-dark-border ${areAllCriteriaMet ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20'}`}>
        <ul className="space-y-1">
            {checklistItems.map((item) => (
                <li key={item.criterion} className="flex items-center">
                    {item.met ? (
                        <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                        <XCircleIcon className="h-5 w-5 text-rose-500 flex-shrink-0" />
                    )}
                    <p className={`text-sm font-medium ${dir === 'ltr' ? 'ml-2' : 'mr-2'} ${item.met ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
                        {item.description}
                    </p>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};