import React from 'react';
import {StyleSheet} from 'react-native';
import Logo from '../../assets/Logo';
import colors from '../../assets/colors';
import Form from './Form';
import {useGeolocationPermission} from '../../useGeolocation';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
const Stack = createStackNavigator();

const App = () => {
  const hasPermission = useGeolocationPermission();

  if (hasPermission) {
    return <Form />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Logo />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary.blue,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
