import 'react-native-get-random-values';

import React, {useEffect, useState} from 'react';
import {enableScreens} from 'react-native-screens';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppContextProvider from './AppContext';
import GeolocationContextProvider from './GeolocationContext';
import NavigationRoot from './navigation';
import trackAppState from './diagnostics/trackAppState';
import ThemeContextProvider from './theme/ThemeContext';
import FavoritesContextProvider from './favorites/FavoritesContext';
import SearchHistoryContextProvider from './search-history';
import TicketContextProvider from './TicketContext';
import RemoteConfigContextProvider from './RemoteConfigContext';
import {loadLocalConfig} from './local-config';
import Bugsnag from '@bugsnag/react-native';
import {setInstallId as setApiInstallId} from './api/client';
import ErrorBoundary from './error-boundary';
import {PreferencesContextProvider} from './preferences';
import configureAndStartBugsnag from './diagnostics/bugsnagConfig';

configureAndStartBugsnag();

import {MAPBOX_API_TOKEN} from '@env';
import MapboxGL from '@react-native-mapbox-gl/maps';
import AppLanguageProvider from './translations/LanguageContext';
import {Platform, UIManager} from 'react-native';

MapboxGL.setAccessToken(MAPBOX_API_TOKEN);

async function setupConfig() {
  const {installId} = await loadLocalConfig();
  Bugsnag.setUser(installId);
  setApiInstallId(installId);
}

trackAppState();
enableScreens();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function config() {
      await setupConfig();
      setIsLoading(false);
    }
    config();
  }, []);
  if (isLoading) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppContextProvider>
          <PreferencesContextProvider>
            <ThemeContextProvider>
              <FavoritesContextProvider>
                <SearchHistoryContextProvider>
                  <GeolocationContextProvider>
                    <TicketContextProvider>
                      <RemoteConfigContextProvider>
                        <AppLanguageProvider>
                          <NavigationRoot />
                        </AppLanguageProvider>
                      </RemoteConfigContextProvider>
                    </TicketContextProvider>
                  </GeolocationContextProvider>
                </SearchHistoryContextProvider>
              </FavoritesContextProvider>
            </ThemeContextProvider>
          </PreferencesContextProvider>
        </AppContextProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default App;
