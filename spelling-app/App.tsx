import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import { Difficulty } from './src/types';

export type RootStackParamList = {
  Home: undefined;
  Game: { difficulty: Difficulty };
  Results: { score: number; total: number; difficulty: Difficulty };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#6200ee' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: '🎯 Spelling Master' }}
          />
          <Stack.Screen 
            name="Game" 
            component={GameScreen}
            options={{ title: '✍️ Practice' }}
          />
          <Stack.Screen 
            name="Results" 
            component={ResultsScreen}
            options={{ title: '🎉 Results' }}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});