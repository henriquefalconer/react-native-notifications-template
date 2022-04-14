/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src';
import { name as appName } from './app.json';
import { setBackgroundMessageHandler } from './src/hooks/useNotifications';

setBackgroundMessageHandler();

AppRegistry.registerComponent(appName, () => App);
