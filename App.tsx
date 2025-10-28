import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { EmailOutput } from './components/EmailOutput';
import { generateEmail, improveSection } from './services/geminiService';
import type { EmailFormData, EmailResult, EmailSection } from './types';
import { DownloadIcon, HtmlIcon, SparklesIcon } from './components/icons/Icons';
import { ImproveModal } from './components/ImproveModal';
import { useLanguage } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { generateHtmlFromEmailResult } from './utils/htmlGenerator';
import { useApiKey } from './contexts/ApiKeyContext';
import { SettingsModal } from './components/SettingsModal';
import { useHtmlStyles } from './contexts/HtmlStylesContext';

const App: React.FC = () => {
  const { language, t, dir, isLoaded } = useLanguage();
  const { apiKey, isKeySet } = useApiKey();
  const { styles: htmlStyles } = useHtmlStyles();
  const [formData, setFormData] = useState<EmailFormData>({
    productName: '',
    audience: '',
    mainGoal: '',
    painPoint: '',
    valueProp: '',
    socialProof: '',
    brandName: '',
    senderName: '',
    senderTitle: '',
  });

  const [emailResult, setEmailResult] = useState<EmailResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImproving, setIsImproving] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [preGenChecklist, setPreGenChecklist] = useState<string[]>([]);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    sectionIndex: number | null;
    section: EmailSection | null;
  }>({ isOpen: false, sectionIndex: null, section: null });
  const [improvementNotes, setImprovementNotes] = useState<string>('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);


  const handleGenerateEmail = useCallback(async () => {
    if (!isKeySet) {
      setError(t('errors.apiKeyMissing'));
      setIsSettingsModalOpen(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setEmailResult(null);
    setPreGenChecklist([]);
    try {
      const result = await generateEmail(formData, language, apiKey as string);
      const resultText = result.text.trim();
      const parsedResult: {pre_generation_checklist: string[], email_data: EmailResult} = JSON.parse(resultText);
      
      setPreGenChecklist(parsedResult.pre_generation_checklist || []);
      setEmailResult(parsedResult.email_data);

    } catch (err) {
      console.error('Error generating email:', err);
      setError(t('generationError'));
    } finally {
      setIsLoading(false);
    }
  }, [formData, language, t, apiKey, isKeySet]);
  
  const handleOpenImproveModal = (index: number, section: EmailSection) => {
    setModalState({ isOpen: true, sectionIndex: index, section: section });
    setImprovementNotes('');
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, sectionIndex: null, section: null });
  };

  const handleImproveSection = useCallback(async () => {
    if (modalState.sectionIndex === null || !modalState.section) return;
    
    if (!isKeySet) {
      setError(t('errors.apiKeyMissing'));
      setIsSettingsModalOpen(true);
      return;
    }

    const index = modalState.sectionIndex;
    const section = modalState.section;

    setIsImproving(prev => ({ ...prev, [index]: true }));
    setError(null);
    try {
      const result = await improveSection(section, improvementNotes, language, apiKey as string);
      const resultText = result.text.trim();
      const improvedSection: EmailSection = JSON.parse(resultText);

      setEmailResult(prevResult => {
        if (!prevResult) return null;
        const newSections = [...prevResult.sections];
        newSections[index] = improvedSection;
        
        const fullEmailText = newSections.map(s => s.content).join('\n\n');
        
        return { ...prevResult, sections: newSections, full_email_text: fullEmailText };
      });
      handleCloseModal();
    } catch (err) {
      console.error(`Error improving section ${index}:`, err);
      setError(t('improvementError'));
      handleCloseModal();
    } finally {
      setIsImproving(prev => ({ ...prev, [index]: false }));
    }
  }, [modalState, improvementNotes, language, t, apiKey, isKeySet]);

  const handleDownload = () => {
    if (!emailResult?.full_email_text) return;
    const blob = new Blob([emailResult.full_email_text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'marketing-email.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleHtmlDownload = () => {
    if (!emailResult) return;
    const htmlContent = generateHtmlFromEmailResult(emailResult, dir, htmlStyles);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'marketing-email.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="animate-spin h-10 w-10 text-primary dark:text-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header onOpenSettings={() => setIsSettingsModalOpen(true)} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <InputForm
                formData={formData}
                setFormData={setFormData}
                onGenerate={handleGenerateEmail}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className="lg:col-span-8">
            {isLoading && (
              <div className="flex justify-center items-center h-96">
                 <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-dark-surface rounded-lg shadow-md">
                  <svg className="animate-spin h-10 w-10 text-primary dark:text-light mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-lg font-semibold text-primary dark:text-dark-primary-text">{t('generatingButton')}</p>
                  <p className="text-primary/80 dark:text-dark-secondary-text mt-2">{language === 'ar' ? 'يقوم الذكاء الاصطناعي بتحليل مدخلاتك لصياغة أفضل نسخة.' : 'The AI is analyzing your input to craft the best copy.'}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md mb-4" role="alert">
                <p className="font-bold">{t('errorTitle')}</p>
                <p>{error}</p>
              </div>
            )}

            {preGenChecklist.length > 0 && !isLoading && (
                <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-sm mb-6">
                    <h3 className="text-lg font-semibold text-primary-dark dark:text-dark-primary-text mb-3">{t('preGenChecklistTitle')}</h3>
                    <ul className="space-y-2">
                        {preGenChecklist.map((item, index) => (
                            <li key={index} className={`flex items-center text-primary dark:text-dark-secondary-text`}>
                                <svg className={`h-5 w-5 text-emerald-500 ${dir === 'ltr' ? 'mr-2' : 'ml-2'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            {emailResult && !isLoading && (
              <>
                <EmailOutput 
                  emailResult={emailResult} 
                  onImproveSection={handleOpenImproveModal} 
                  isImproving={isImproving}
                />
                <div className="mt-8 flex justify-center items-center gap-4">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-dark-border text-base font-medium rounded-md shadow-sm text-primary-dark dark:text-dark-primary-text bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <DownloadIcon className={`h-5 w-5 ${dir === 'ltr' ? 'mr-2' : 'ml-2'}`} />
                    {t('saveButton')}
                  </button>
                   <button
                    onClick={handleHtmlDownload}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <HtmlIcon className={`h-5 w-5 ${dir === 'ltr' ? 'mr-2' : 'ml-2'}`} />
                    {t('saveHtmlButton')}
                  </button>
                </div>
              </>
            )}

            {!emailResult && !isLoading && !error && (
                <div className="text-center py-12 px-6 bg-white dark:bg-dark-surface rounded-lg shadow-sm">
                    <SparklesIcon className="mx-auto h-12 w-12 text-accent dark:text-dark-secondary-text" />
                    <h3 className="mt-4 text-xl font-semibold text-primary-dark dark:text-dark-primary-text">{t('readyToStart')}</h3>
                    <p className="mt-2 text-primary dark:text-dark-secondary-text">
                       {t('fillFormPrompt')}
                    </p>
                </div>
            )}
          </div>
        </div>
      </main>
      <ImproveModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onImprove={handleImproveSection}
        notes={improvementNotes}
        setNotes={setImprovementNotes}
        isImproving={modalState.sectionIndex !== null ? isImproving[modalState.sectionIndex] : false}
        sectionName={modalState.section?.name}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

export default App;