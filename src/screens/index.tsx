import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChartAccounts from './ChartAccounts';

const { Navigator, Screen } = createStackNavigator();

export default function AppNavigator(): JSX.Element {
  return (
    <NavigationContainer>
      <Navigator>
        <Screen
          component={ChartAccounts}
          name="ChartAccounts"
          options={{ headerShown: false }}
        />
      </Navigator>
    </NavigationContainer>
  );
}
