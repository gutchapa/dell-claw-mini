import React from 'react';
import { StatusBar } from 'expo-status-bar';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { default as theme } from './theme.json';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import { RootStackParamList } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator 
            screenOptions={{ 
              headerShown: false,
              cardStyle: { backgroundColor: '#f7f9fc' }
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
            <Stack.Screen name="Results" component={ResultsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}
