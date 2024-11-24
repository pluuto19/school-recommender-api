import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

const WelcomeScreen = ({ navigate }: { navigate: (screen: string) => void }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Welcome to School Finder
      </Text>
      <Text style={styles.subtitle}>
        Discover the best schools near you and make informed decisions.
      </Text>
      <Button
        mode="contained"
        onPress={() => navigate('Auth')}
        style={styles.button}
      >
        Get Started
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    color: '#6b6b6b',
  },
  button: {
    width: '80%',
    paddingVertical: 8,
  },
});

export default WelcomeScreen;
