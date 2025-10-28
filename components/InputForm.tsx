import React from 'react';
import type { EmailFormData } from '../types';
import { SparklesIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface InputFormProps {
  formData: EmailFormData;
  setFormData: React.Dispatch<React.SetStateAction<EmailFormData>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const formFieldKeys: (keyof EmailFormData)[] = [
    'productName', 'audience', 'mainGoal', 'painPoint', 
    'valueProp', 'socialProof', 'brandName', 'senderName', 'senderTitle'
];
const formFieldTypes: Record<keyof EmailFormData, 'input' | 'textarea'> = {
    productName: 'input',
    audience: 'textarea',
    mainGoal: 'input',
    painPoint: 'textarea',
    valueProp: 'textarea',
    socialProof: 'input',
    brandName: 'input',
    senderName: 'input',
    senderTitle: 'input',
};

export const InputForm: React.FC<InputFormProps> = ({ formData, setFormData, onGenerate, isLoading }) => {
  const { t, dir } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-primary-dark dark:text-dark-primary-text">{t('formTitle')}</h2>
      <form className="space-y-4">
        {formFieldKeys.map(fieldId => (
             <div key={fieldId}>
                <label htmlFor={fieldId} className="block text-sm font-medium text-primary dark:text-dark-secondary-text mb-1">
                    {t(`formFields.${fieldId}.label`)}
                </label>
                {formFieldTypes[fieldId] === 'input' ? (
                     <input
                        type="text"
                        name={fieldId}
                        id={fieldId}
                        value={formData[fieldId]}
                        onChange={handleChange}
                        placeholder={t(`formFields.${fieldId}.placeholder`)}
                        className="block w-full px-3 py-2 bg-white dark:bg-dark-bg text-primary-dark dark:text-dark-primary-text border border-gray-300 dark:border-dark-border rounded-md shadow-sm placeholder-gray-500 dark:placeholder-dark-secondary-text focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                ) : (
                    <textarea
                        name={fieldId}
                        id={fieldId}
                        value={formData[fieldId]}
                        onChange={handleChange}
                        placeholder={t(`formFields.${fieldId}.placeholder`)}
                        rows={3}
                        className="block w-full px-3 py-2 bg-white dark:bg-dark-bg text-primary-dark dark:text-dark-primary-text border border-gray-300 dark:border-dark-border rounded-md shadow-sm placeholder-gray-500 dark:placeholder-dark-secondary-text focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                )}
           </div>
        ))}
       
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-accent disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className={dir === 'ltr' ? 'ml-3' : 'mr-3'}>{t('generatingButton')}</span>
            </>
          ) : (
            <>
              <SparklesIcon className={`h-5 w-5 ${dir === 'ltr' ? 'mr-2' : 'ml-2'}`} />
              {t('generateButton')}
            </>
          )}
        </button>
      </form>
    </div>
  );
};