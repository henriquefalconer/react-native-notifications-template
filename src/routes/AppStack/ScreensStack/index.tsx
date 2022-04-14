import React from 'react';

import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import Home from '@screens/Home';

export type ScreensStackScreens = {
  Home: undefined;
};

export type ScreensStackScreensProps = StackNavigationProp<ScreensStackScreens>;

const { Navigator, Screen } = createStackNavigator<ScreensStackScreens>();

const ScreensStack = () => (
  <Navigator screenOptions={{ header: () => <></> }}>
    <Screen name="Home" component={Home} />
  </Navigator>
);

export default ScreensStack;
