import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';

const SignUpScreen = ({ navigate }: { navigate: (screen: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword || !location) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all the fields.',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match.',
      });
      return;
    }

    // Simulate successful sign-up
    Toast.show({
      type: 'success',
      text1: 'Sign-Up Successful',
      text2: 'Welcome! Please log in.',
    });

    navigate('Auth'); // Navigate back to login
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Sign Up
      </Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Location"
        value={location}
        onChangeText={setLocation}
        mode="outlined"
        placeholder="Enter your city or region"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSignUp} style={styles.signUpButton}>
        Sign Up
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigate('Auth')}
        style={styles.backButton}
      >
        Back to Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  signUpButton: {
    marginTop: 16,
  },
  backButton: {
    marginTop: 8,
  },
});

export default SignUpScreen;
