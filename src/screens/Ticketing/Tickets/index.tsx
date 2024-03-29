import React, {useMemo} from 'react';
import {View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../../ScreenHeader';
import LogoOutline from '../../../ScreenHeader/LogoOutline';
import useChatIcon from '../../../chat/use-chat-icon';
import {useNavigateToStartScreen} from '../../../utils/navigation';
import {StyleSheet} from '../../../theme';
import TabBar from './TabBar';
import {ActiveTickets, ExpiredTickets} from './Tabs';
import ThemeIcon from '../../../components/theme-icon';

export const ActiveTicketsScreenName = 'ActiveTickets';

export type TicketTabsNavigatorParams = {
  [ActiveTicketsScreenName]: undefined;
  ExpiredTickets: undefined;
};

const Tab = createMaterialTopTabNavigator<TicketTabsNavigatorParams>();

export default function TicketTabs() {
  const styles = useStyles();
  const chatIcon = useChatIcon();
  const navigateHome = useNavigateToStartScreen();
  const {top} = useSafeAreaInsets();
  const screenTopStyle = useMemo(
    () => ({
      paddingTop: top,
    }),
    [top],
  );

  return (
    <View style={[styles.container, screenTopStyle]}>
      <Header
        title="Billetter"
        rightButton={chatIcon}
        leftButton={{
          icon: <ThemeIcon svg={LogoOutline} />,
          onPress: navigateHome,
          accessibilityLabel: 'Gå til startside',
        }}
      />
      <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
        <Tab.Screen
          name={ActiveTicketsScreenName}
          component={ActiveTickets}
          options={{tabBarLabel: 'Aktive'}}
        />
        <Tab.Screen
          name="ExpiredTickets"
          component={ExpiredTickets}
          options={{tabBarLabel: 'Utløpte'}}
        />
      </Tab.Navigator>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, backgroundColor: theme.background.header},
}));
