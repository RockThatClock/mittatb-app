import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  PlannerIcon,
  NearestIcon,
  ProfileIcon,
  TicketingIcon,
} from './TabBarIcons';
import Assistant from '../screens/Assistant';
import NearbyScreen from '../screens/Nearby';
import TicketingScreen from '../screens/Ticketing';
import ProfileScreen from '../screens/Profile';
import {LocationWithSearchMetadata} from '../location-search';
import {useRemoteConfig} from '../RemoteConfigContext';
import {defineMessages, useIntl} from 'react-intl';

export type TabNavigatorParams = {
  Assistant: {
    fromLocation: LocationWithSearchMetadata;
    toLocation: LocationWithSearchMetadata;
  };
  Nearest: {
    location: LocationWithSearchMetadata;
  };
  Ticketing: undefined;
  Profile: undefined;
};

const messages = defineMessages({
  assistant: 'Reiseassistent',
  nearby: 'Avganger i nærheten',
  ticketing: 'Reisebevis',
  profile: 'Mitt AtB',
});

const Tab = createBottomTabNavigator<TabNavigatorParams>();

const NavigationRoot = () => {
  const {enable_ticketing} = useRemoteConfig();
  const {formatMessage} = useIntl();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Assistant"
        component={Assistant}
        options={{
          tabBarLabel: formatMessage(messages.assistant),
          tabBarIcon: ({color}) => <PlannerIcon fill={color} />,
        }}
      />
      <Tab.Screen
        name="Nearest"
        component={NearbyScreen}
        options={{
          tabBarLabel: formatMessage(messages.nearby),
          tabBarIcon: ({color}) => <NearestIcon fill={color} />,
        }}
      />
      {enable_ticketing ? (
        <Tab.Screen
          name="Ticketing"
          component={TicketingScreen}
          options={{
            tabBarLabel: formatMessage(messages.ticketing),
            tabBarIcon: ({color}) => <TicketingIcon fill={color} />,
          }}
        />
      ) : null}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: formatMessage(messages.profile),
          tabBarIcon: ({color}) => <ProfileIcon fill={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default NavigationRoot;
