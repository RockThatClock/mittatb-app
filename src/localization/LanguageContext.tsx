import React, {useState, useEffect, useContext, createContext} from 'react';
import {
  createIntl,
  createIntlCache,
  RawIntlProvider,
  IntlShape,
} from 'react-intl';
import flatten from 'flat';
import defaultLocale from '../translations/nb.json';

// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache();

export type SupportedLocales = 'nb' | 'en';
export let Language = createFlattenedIntl('nb', defaultLocale);

export async function importMessages(
  locale: SupportedLocales,
): Promise<IntlShape> {
  switch (locale) {
    case 'en':
      const enMessages = await import('../translations/en.json');
      const enLocale = createFlattenedIntl('en', enMessages);
      Language = enLocale;
      return enLocale;

    case 'nb':
      const nbMessages = await import('../translations/nb.json');
      const nbLocale = createFlattenedIntl('nb', nbMessages);
      Language = nbLocale;
      return nbLocale;
  }
}

function createFlattenedIntl(locale: SupportedLocales, messages: any) {
  return createIntl(
    {
      locale,
      messages: flatten(messages),
      onError: (err) => console.warn(err),
    },
    cache,
  );
}

type LanguageContextState = {
  change: (locale: SupportedLocales) => void;
};

const LanguageContext = createContext<undefined | LanguageContextState>(
  undefined,
);

const LanguageContextProvider: React.FC = ({children}) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLocales>(
    'nb',
  );
  const [currentMessages, setCurrentMessages] = useState(Language);

  useEffect(() => {
    // get device language / saved language
    setCurrentLanguage('nb');
  }, []);

  useEffect(() => {
    changeLanguage(currentLanguage);
  }, [currentLanguage]);

  async function changeLanguage(language: SupportedLocales) {
    const messages = await importMessages(language);
    setCurrentMessages(messages);
  }

  return (
    <LanguageContext.Provider value={{change: setCurrentLanguage}}>
      <RawIntlProvider value={currentMessages}>{children}</RawIntlProvider>
    </LanguageContext.Provider>
  );
};

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error(
      'useLanguageContext must be used within a LanguageContextProvider',
    );
  }
  return context;
}

export default LanguageContextProvider;
