import React from 'react';

import { NavigatorScreenParams } from '@react-navigation/core';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import useAuth from '@hooks/useAuth';
import useNotifications from '@hooks/useNotifications';

import AuthStack, { AuthStackScreens } from './AuthStack';
import ScreensStack, { ScreensStackScreens } from './ScreensStack';

export type AppStackScreens = {
  AuthStack: NavigatorScreenParams<AuthStackScreens>;
  ScreensStack: NavigatorScreenParams<ScreensStackScreens>;
};

export type AppStackScreensProps = StackNavigationProp<AppStackScreens>;

const { Screen, Navigator } = createStackNavigator<AppStackScreens>();

const AppStack = () => {
  // Enables notifications.
  useNotifications();

  const { token } = useAuth();

  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Screen name="ScreensStack" component={ScreensStack} />
      ) : (
        <Screen name="AuthStack" component={AuthStack} />
      )}
    </Navigator>
  );
};

export default AppStack;
