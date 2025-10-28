import React, { useState } from 'react';
import { useHtmlStyles, STYLABLE_SECTIONS } from '../contexts/HtmlStylesContext';
import { useLanguage } from '../contexts/LanguageContext';

const FONT_FAMILIES = [
    "Arial, sans-serif",
    "Verdana, sans-serif",
    "Tahoma, sans-serif",
    "Trebuchet MS, sans-serif",
    "Times New Roman, serif",
    "Georgia, serif",
    "Garamond, serif",
    "Courier New, monospace",
    "Brush Script MT, cursive"
];

export const HtmlStyleEditor: React.FC = () => {
    const { styles, updateStyle, resetStyles } = useHtmlStyles();
    const { t } = useLanguage();
    const [selectedSection, setSelectedSection] = useState(STYLABLE_SECTIONS[0]);

    const currentStyle = styles[selectedSection] || {};

    const handleStyleChange = (property: string, value: string) => {
        updateStyle(selectedSection, { [property]: value });
    };

    const handleColorChange = (property: string, value: string) => {
        if (value) {
            updateStyle(selectedSection, { [property]: value });
        }
    };
    
    return (
        <div className="space-y-4 pb-6">
            <div>
                <label htmlFor="section-select" className="block text-sm font-medium text-primary dark:text-dark-secondary-text mb-1">{t('settingsModal.html.selectSection')}</label>
                <select 
                    id="section-select"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="block w-full px-3 py-2 bg-white dark:bg-dark-bg text-primary-dark dark:text-dark-primary-text border border-gray-300 dark:border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                    {STYLABLE_SECTIONS.map(section => (
                        <option key={section} value={section}>{t(`settingsModal.html.sections.${section.split(' ')[0]}`, section)}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="font-family" className="block text-sm font-medium text-primary dark:text-dark-secondary-text mb-1">{t('settingsModal.html.fontFamily')}</label>
                    <select
                        id="font-family"
                        value={currentStyle.fontFamily || ''}
                        onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                         className="block w-full px-3 py-2 bg-white dark:bg-dark-bg text-primary-dark dark:text-dark-primary-text border border-gray-300 dark:border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                        <option value="">{t('settingsModal.html.default')}</option>
                        {FONT_FAMILIES.map(font => <option key={font} value={font}>{font.split(',')[0]}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="font-size" className="block text-sm font-medium text-primary dark:text-dark-secondary-text mb-1">{t('settingsModal.html.fontSize')}</label>
                    <input
                        id="font-size"
                        type="text"
                        placeholder="e.g., 16px"
                        value={currentStyle.fontSize || ''}
                        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                        className="block w-full px-3 py-2 bg-white dark:bg-dark-bg text-primary-dark dark:text-dark-primary-text border border-gray-300 dark:border-dark-border rounded-md shadow-sm placeholder-gray-500 dark:placeholder-dark-secondary-text focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="font-weight" className="block text-sm font-medium text-primary dark:text-dark-secondary-text mb-1">{t('settingsModal.html.fontWeight')}</label>
                    <select
                        id="font-weight"
                        value={currentStyle.fontWeight || ''}
                        onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                         className="block w-full px-3 py-2 bg-white dark:bg-dark-bg text-primary-dark dark:text-dark-primary-text border border-gray-300 dark:border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                        <option value="">{t('settingsModal.html.default')}</option>
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                        <option value="600">600</option>
                        <option value="700">700</option>
                        <option value="800">800</option>
                        <option value="900">900</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="font-style" className="block text-sm font-medium text-primary dark:text-dark-secondary-text mb-1">{t('settingsModal.html.fontStyle')}</label>
                    <select
                        id="font-style"
                        value={currentStyle.fontStyle || ''}
                        onChange={(e) => handleStyleChange('fontStyle', e.target.value)}
                         className="block w-full px-3 py-2 bg-white dark:bg-dark-bg text-primary-dark dark:text-dark-primary-text border border-gray-300 dark:border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                        <option value="">{t('settingsModal.html.default')}</option>
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                        <option value="oblique">Oblique</option>
                    </select>
                </div>
                <div className="flex items-center gap-4">
                    <label htmlFor="color" className="block text-sm font-medium text-primary dark:text-dark-secondary-text">{t('settingsModal.html.color')}</label>
                    <input
                        id="color"
                        type="color"
                        value={typeof currentStyle.color === 'string' ? currentStyle.color : '#000000'}
                        onChange={(e) => handleColorChange('color', e.target.value)}
                        className="w-10 h-10 p-1 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md shadow-sm cursor-pointer"
                    />
                </div>
                 <div className="flex items-center gap-4">
                    <label htmlFor="background-color" className="block text-sm font-medium text-primary dark:text-dark-secondary-text">{t('settingsModal.html.backgroundColor')}</label>
                    <input
                        id="background-color"
                        type="color"
                        value={typeof currentStyle.backgroundColor === 'string' ? currentStyle.backgroundColor : '#ffffff'}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        className="w-10 h-10 p-1 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-md shadow-sm cursor-pointer"
                    />
                </div>
            </div>
             <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
                <button
                    onClick={resetStyles}
                    type="button"
                    className="w-full text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >{t('settingsModal.html.resetAll')}</button>
            </div>
        </div>
    );
};
