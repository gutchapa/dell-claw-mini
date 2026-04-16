import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Difficulty } from '../types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface DifficultyOption {
  key: Difficulty;
  label: string;
  color: string;
  emoji: string;
  gradient: string[];
}

const { width } = Dimensions.get('window');

const difficulties: DifficultyOption[] = [
  { 
    key: 'simple', 
    label: 'Simple', 
    color: '#4CAF50', 
    emoji: '🌱',
    gradient: ['#81C784', '#4CAF50']
  },
  { 
    key: 'medium', 
    label: 'Medium', 
    color: '#FF9800', 
    emoji: '🌿',
    gradient: ['#FFB74D', '#FF9800']
  },
  { 
    key: 'hard', 
    label: 'Hard', 
    color: '#F44336', 
    emoji: '🌲',
    gradient: ['#E57373', '#F44336']
  },
  { 
    key: 'veryHard', 
    label: 'Very Hard', 
    color: '#9C27B0', 
    emoji: '🏔️',
    gradient: ['#BA68C8', '#9C27B0']
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDifficultySelect = (difficulty: Difficulty) => {
    navigation.navigate('Game', { difficulty });
  };

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.headerContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <Text style={styles.emojiTitle}>🎯</Text>
        <Text style={styles.title}>Spelling Master</Text>
        <Text style={styles.subtitle}>Choose your challenge</Text>
      </Animated.View>
      
      {/* Animated Buttons */}
      <Animated.View 
        style={[
          styles.buttonsContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        {difficulties.map(({ key, label, color, emoji }, index) => (
          <AnimatedButton
            key={key}
            label={label}
            color={color}
            emoji={emoji}
            index={index}
            onPress={() => handleDifficultySelect(key)}
          />
        ))}
      </Animated.View>
      
      {/* Decorative Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>✨ Practice makes perfect! ✨</Text>
      </Animated.View>
    </View>
  );
};

// Animated Button Component
const AnimatedButton = ({ 
  label, 
  color, 
  emoji, 
  index, 
  onPress 
}: { 
  label: string; 
  color: string; 
  emoji: string; 
  index: number;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  
  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.button, { backgroundColor: color }]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonEmoji}>{emoji}</Text>
          <Text style={styles.buttonText}>{label}</Text>
        </View>
        <View style={[styles.buttonShine, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emojiTitle: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 10,
    fontWeight: '500',
  },
  buttonsContainer: {
    gap: 15,
    paddingHorizontal: 10,
  },
  button: {
    padding: 25,
    borderRadius: 20,
    marginVertical: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonEmoji: {
    fontSize: 36,
    marginRight: 15,
  },
  buttonText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
});

export default HomeScreen;
