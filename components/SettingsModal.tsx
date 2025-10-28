import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SettingsIcon, InfoIcon } from './icons/Icons';
import { useApiKey } from '../contexts/ApiKeyContext';
import { HtmlStyleEditor } from './HtmlStyleEditor';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeySettings: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { apiKey, setApiKey } = useApiKey();
    const [localKey, setLocalKey] = useState(apiKey || '');
    const { t } = useLanguage();

    useEffect(() => {
        setLocalKey(apiKey || '');
    }, [apiKey])

    const handleSave = () => {
        setApiKey(localKey.trim());
        onClose();
    };

    return (
        <>
            <div>
                <label htmlFor="api-key-input" className="block text-sm font-medium text-primary dark:text-dark-secondary-text mb-1">
                {t('apiKeyModal.label')}
                </label>
                <input
                id="api-key-input"
                type="password"
                className="block w-full px-3 py-2 bg-white dark:bg-dark-bg text-primary-dark dark:text-dark-primary-text border border-gray-300 dark:border-dark-border rounded-md shadow-sm placeholder-gray-500 dark:placeholder-dark-secondary-text focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder={t('apiKeyModal.placeholder')}
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                />
                <p className="mt-2 text-xs text-primary/70 dark:text-dark-secondary-text">
                    {t('apiKeyModal.instructions')} <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Google AI Studio</a>.
                </p>
            </div>
            <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-900/30 rounded-lg flex items-start gap-3">
                <InfoIcon className="h-5 w-5 text-sky-600 dark:text-sky-300 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-sky-800 dark:text-sky-200">
                    {t('apiKeyModal.securityWarning')}
                </p>
            </div>
             <div className="bg-gray-50 dark:bg-dark-bg/50 px-6 py-3 -mx-6 -mb-6 mt-6 flex justify-end gap-3 rounded-b-lg">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-white dark:bg-dark-surface text-sm font-medium text-gray-700 dark:text-dark-secondary-text border border-gray-300 dark:border-dark-border rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-dark-border/50 focus:outline-none"
                >
                    {t('apiKeyModal.close')}
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none"
                >
                    {t('apiKeyModal.save')}
                </button>
            </div>
        </>
    )
}


export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState('apiKey');

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-bold text-primary-dark dark:text-dark-primary-text flex items-center">
            <SettingsIcon className={`h-5 w-5 text-primary dark:text-light ${dir === 'ltr' ? 'mr-2' : 'ml-2'}`}/>
            {t('settings')}
          </h3>
          <div className="border-b border-gray-200 dark:border-dark-border mt-4">
              <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                  <button onClick={() => setActiveTab('apiKey')} className={`${activeTab === 'apiKey' ? 'border-primary text-primary-dark dark:border-light dark:text-dark-primary-text' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-secondary-text dark:hover:text-dark-primary-text dark:hover:border-dark-border'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>
                      {t('settingsModal.apiKey.tab')}
                  </button>
                  <button onClick={() => setActiveTab('htmlStyles')} className={`${activeTab === 'htmlStyles' ? 'border-primary text-primary-dark dark:border-light dark:text-dark-primary-text' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-secondary-text dark:hover:text-dark-primary-text dark:hover:border-dark-border'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>
                      {t('settingsModal.html.tab')}
                  </button>
              </nav>
          </div>

          <div className="mt-6">
              {activeTab === 'apiKey' && <ApiKeySettings onClose={onClose} />}
              {activeTab === 'htmlStyles' && <HtmlStyleEditor />}
          </div>
        </div>
        { activeTab === 'htmlStyles' && 
            <div className="bg-gray-50 dark:bg-dark-bg/50 px-6 py-3 flex justify-end gap-3 rounded-b-lg -mt-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-white dark:bg-dark-surface text-sm font-medium text-gray-700 dark:text-dark-secondary-text border border-gray-300 dark:border-dark-border rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-dark-border/50 focus:outline-none"
                >
                    {t('apiKeyModal.close')}
                </button>
            </div>
        }
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
