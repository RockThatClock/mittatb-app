import 'react-native-get-random-values';
import './localization';

import React, {useEffect, useState} from 'react';
import {enableScreens} from 'react-native-screens';
import AppContextProvider from './AppContext';
import GeolocationContextProvider from './geolocation';
import NavigationRoot from './navigation';
import trackAppState from './diagnostics/trackAppState';
import ThemeContextProvider from './theme/ThemeContext';
import FavoritesContextProvider from './favorites/FavoritesContext';
import SearchHistoryContextProvider from './search-history';
import RemoteConfigContextProvider from './RemoteConfigContext';
import {loadLocalConfig} from './local-config';
import Splash from './screens/Splash';
import Intercom from 'react-native-intercom';
import {Platform} from 'react-native';
import LanguageContext from './localization/LanguageContext';

Intercom.setBottomPadding(Platform.OS === 'ios' ? 40 : 80);
trackAppState();
enableScreens();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function run() {
      await loadLocalConfig();
      setIsLoading(false);
    }

    run();
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <LanguageContext>
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
    </LanguageContext>
  );
};

export default App;
