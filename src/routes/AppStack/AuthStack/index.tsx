import React from 'react';

import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import Login from '@screens/Login';

export type AuthStackScreens = {
  Login: undefined;
};

export type AuthStackScreensProps = StackNavigationProp<AuthStackScreens>;

const { Screen, Navigator } = createStackNavigator<AuthStackScreens>();

const AuthStack = () => (
  <Navigator screenOptions={{ headerShown: false }}>
    <Screen name="Login" component={Login} />
  </Navigator>
);

export default AuthStack;
