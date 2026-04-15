import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TestApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TEST</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => console.log('BUTTON CLICKED!')}
      >
        <Text>Click Me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, marginBottom: 20 },
  button: { padding: 20, backgroundColor: '#4CAF50', borderRadius: 10 }
});
