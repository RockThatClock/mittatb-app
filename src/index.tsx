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
import RemoteConfigContextProvider from './RemoteConfigContext';
import {loadLocalConfig} from './local-config';
import Bugsnag from '@bugsnag/react-native';
import ErrorBoundary from './error-boundary';

if (!__DEV__) {
  Bugsnag.start();
} else {
  Bugsnag.notify = () => {};
  Bugsnag.setUser = () => {};
  Bugsnag.leaveBreadcrumb = () => {};
}

import {MAPBOX_API_TOKEN} from 'react-native-dotenv';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {configureErrorMiddleware, configureInstallId} from './api';
import dataErrorLogger from './diagnostics/dataErrorLogger';
MapboxGL.setAccessToken(MAPBOX_API_TOKEN);

async function setupConfig() {
  const {installId} = await loadLocalConfig();
  Bugsnag.setUser(installId);
  configureErrorMiddleware(dataErrorLogger);
  configureInstallId(installId);
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
          <ThemeContextProvider>
            <FavoritesContextProvider>
              <SearchHistoryContextProvider>
                <GeolocationContextProvider>
                  <RemoteConfigContextProvider>
                    <NavigationRoot />
                  </RemoteConfigContextProvider>
                </GeolocationContextProvider>
              </SearchHistoryContextProvider>
            </FavoritesContextProvider>
          </ThemeContextProvider>
        </AppContextProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default App;
