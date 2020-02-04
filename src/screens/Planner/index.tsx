import React from 'react';
import {TripPattern} from '../../sdk';
import Overview from './Overview';
import {createStackNavigator} from '@react-navigation/stack';
import Detail from './Details';
import colors from '../../assets/colors';

export type PlannerStackParams = {
  Overview: undefined;
  Detail: {tripPattern: TripPattern};
};

const Stack = createStackNavigator<PlannerStackParams>();

const PlannerRoot = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Overview"
        component={Overview}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{
          headerTintColor: colors.general.white,
          headerBackTitleVisible: false,
          headerTitle: '',
          headerStyle: {
            backgroundColor: colors.primary.gray,
            shadowOpacity: 0,
            borderWidth: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default PlannerRoot;
