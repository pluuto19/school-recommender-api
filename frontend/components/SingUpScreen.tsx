import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { api } from '../services/api';

const SignUpScreen = ({ navigate }: { navigate: (screen: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = async () => {
    if (!username || !password || !confirmPassword || !name) {
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

    try {
      const response = await api.register(username, password, name);
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Sign-Up Successful',
          text2: 'Welcome! Please log in.',
        });
        navigate('Auth');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Registration failed',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Sign Up
      </Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Full Name"
        value={name}
        onChangeText={setName}
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
