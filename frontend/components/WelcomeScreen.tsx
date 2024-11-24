import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, Button } from 'react-native-paper';

const WelcomeScreen = ({ navigate }: { navigate: (screen: string) => void }) => {
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current; // Fade-in for title
  const slideAnim = useRef(new Animated.Value(50)).current; // Slide-up for button
  const subtitleFade = useRef(new Animated.Value(0)).current; // Fade-in for subtitle

  useEffect(() => {
    // Parallel animations for smoother entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        delay: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, subtitleFade]);

  return (
    <View style={styles.container}>
      {/* Animated Title */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text variant="headlineLarge" style={styles.title}>
          Welcome to School Finder
        </Text>
      </Animated.View>

      {/* Animated Subtitle */}
      <Animated.View style={{ opacity: subtitleFade }}>
        <Text style={styles.subtitle}>
          Discover the best schools near you and make informed decisions.
        </Text>
      </Animated.View>

      {/* Animated Button */}
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <Button
          mode="contained"
          onPress={() => navigate('Auth')}
          style={styles.button}
        >
          Get Started
        </Button>
      </Animated.View>
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
  },
});

export default WelcomeScreen;
