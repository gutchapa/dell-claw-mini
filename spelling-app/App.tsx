import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { default as theme } from './theme.json';
import ProfileSelectionScreen from './src/screens/ProfileSelectionScreen';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <Layout style={{ flex: 1 }}>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator 
              initialRouteName="ProfileSelection"
              screenOptions={{ 
                headerShown: false,
              }}
            >
              <Stack.Screen name="ProfileSelection" component={ProfileSelectionScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Game" component={GameScreen} />
              <Stack.Screen name="Results" component={ResultsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Layout>
      </ApplicationProvider>
    </View>
  );
}
