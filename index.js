/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// Ignore all warnings
// LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appName, () => App);
