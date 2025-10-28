import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

type ApiKeyContextType = {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isKeySet: boolean;
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyInternal] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(API_KEY_STORAGE_KEY);
    }
    return null;
  });

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }, [apiKey]);
  
  const setApiKey = (key: string | null) => {
    setApiKeyInternal(key);
  };

  const value = useMemo(() => ({
    apiKey,
    setApiKey,
    isKeySet: !!apiKey,
  }), [apiKey]);

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
