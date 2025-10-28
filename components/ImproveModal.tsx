import React from 'react';
import { SparklesIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface ImproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImprove: () => void;
  notes: string;
  setNotes: (notes: string) => void;
  isImproving: boolean;
  sectionName?: string | null;
}

export const ImproveModal: React.FC<ImproveModalProps> = ({
  isOpen,
  onClose,
  onImprove,
  notes,
  setNotes,
  isImproving,
  sectionName,
}) => {
  const { t, dir } = useLanguage();
  if (!isOpen) return null;

  const [name] = sectionName?.split('(') || ['Section'];

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        role="dialog" 
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-bold text-primary-dark dark:text-dark-primary-text flex items-center">
            <SparklesIcon className={`h-5 w-5 text-primary dark:text-light ${dir === 'ltr' ? 'mr-2' : 'ml-2'}`}/>
            {t('improveModal.title')} {name.trim()}
          </h3>
          <div className="mt-4">
            <label htmlFor="improvement-notes" className="block text-sm font-medium text-primary dark:text-dark-secondary-text mb-1">
              {t('improveModal.notesLabel')}
            </label>
            <textarea
              id="improvement-notes"
              rows={4}
              className="block w-full px-3 py-2 bg-white dark:bg-dark-bg text-primary-dark dark:text-dark-primary-text border border-gray-300 dark:border-dark-border rounded-md shadow-sm placeholder-gray-500 dark:placeholder-dark-secondary-text focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder={t('improveModal.notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <p className="mt-1 text-xs text-primary/70 dark:text-dark-secondary-text">
              {t('improveModal.notesHint')}
            </p>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-dark-bg/50 px-6 py-3 flex justify-end gap-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-dark-surface text-sm font-medium text-gray-700 dark:text-dark-secondary-text border border-gray-300 dark:border-dark-border rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-dark-border/50 focus:outline-none"
          >
            {t('improveModal.cancel')}
          </button>
          <button
            type="button"
            onClick={onImprove}
            disabled={isImproving}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none disabled:bg-accent disabled:cursor-not-allowed"
          >
            {isImproving ? (
               <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className={dir === 'ltr' ? 'ml-2' : 'mr-2'}>{t('improvingButton')}</span>
              </>
            ) : (
                t('improveModal.improveNow')
            )}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeInScale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};