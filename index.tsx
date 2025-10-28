import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ApiKeyProvider } from './contexts/ApiKeyContext';
import { HtmlStylesProvider } from './contexts/HtmlStylesContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <ApiKeyProvider>
          <HtmlStylesProvider>
            <App />
          </HtmlStylesProvider>
        </ApiKeyProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);