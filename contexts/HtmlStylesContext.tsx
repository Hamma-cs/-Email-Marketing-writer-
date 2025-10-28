import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const HTML_STYLES_STORAGE_KEY = 'html_export_styles';

// Define the keys for sections that can be styled
export const STYLABLE_SECTIONS = [
    'Global Styles',
    'Header Image or Clean Hero Section',
    'Opening Line',
    'Body Copy',
    'Social Proof / Micro-Story / Case Snippet',
    'Call-to-Action',
    'Secondary CTA',
    'Signature Block',
    'Footer'
];

export type StyleObject = React.CSSProperties;
export type HtmlStyles = {
  [key: string]: StyleObject;
};

type HtmlStylesContextType = {
  styles: HtmlStyles;
  updateStyle: (section: string, newStyles: StyleObject) => void;
  resetStyles: () => void;
};

const defaultStyles: HtmlStyles = {
    'Global Styles': {
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
        fontSize: '16px',
        color: '#333333',
        backgroundColor: '#ffffff'
    },
    'Call-to-Action': {
        backgroundColor: '#34495e',
        color: '#ffffff',
        fontWeight: 'bold',
    },
    'Secondary CTA': {
        color: '#34495e',
    },
    'Footer': {
        backgroundColor: '#f4f4f4',
        color: '#777777',
        fontSize: '12px',
    }
};


const HtmlStylesContext = createContext<HtmlStylesContextType | undefined>(undefined);

export const HtmlStylesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [styles, setStyles] = useState<HtmlStyles>(() => {
    if (typeof window !== 'undefined') {
        try {
            const storedStyles = localStorage.getItem(HTML_STYLES_STORAGE_KEY);
            return storedStyles ? JSON.parse(storedStyles) : defaultStyles;
        } catch (error) {
            console.error("Failed to parse stored HTML styles:", error);
            return defaultStyles;
        }
    }
    return defaultStyles;
  });

  useEffect(() => {
    localStorage.setItem(HTML_STYLES_STORAGE_KEY, JSON.stringify(styles));
  }, [styles]);
  
  const updateStyle = (section: string, newStyles: StyleObject) => {
    setStyles(prev => ({
        ...prev,
        [section]: {
            ...prev[section],
            ...newStyles
        }
    }));
  };

  const resetStyles = () => {
    setStyles(defaultStyles);
  }

  const value = useMemo(() => ({
    styles,
    updateStyle,
    resetStyles
  }), [styles]);

  return (
    <HtmlStylesContext.Provider value={value}>
      {children}
    </HtmlStylesContext.Provider>
  );
};

export const useHtmlStyles = (): HtmlStylesContextType => {
  const context = useContext(HtmlStylesContext);
  if (context === undefined) {    
    throw new Error('useHtmlStyles must be used within an HtmlStylesProvider');
  }
  return context;
};
