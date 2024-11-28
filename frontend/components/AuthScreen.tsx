import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message'; // Import Toast
import { api } from '../services/api'; // Import API service

const AuthScreen = ({ navigate }: { navigate: (screen: string, params?: any) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Both email and password are required.');
      console.log('Validation failed:', { email, password });
      return;
    }

    try {
      console.log('Attempting login with:', { email, password });
      const response = await api.login(email, password);
      console.log('Login response received:', response);
      
      if (response.success) {
        setError(null);
        console.log('Login successful');
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome to School Finder! 🎉'
        });
        setTimeout(() => navigate('Home', { user: response.user }), 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Invalid Credentials',
        text2: 'Please check your username or password.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Login
      </Text>
      {error && <Text style={styles.errorText}>{error}</Text>} {/* Display errors */}
      <TextInput
        label="Username"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        mode="outlined"
        secureTextEntry
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigate('SignUp')}
        style={styles.button}
      >
        Sign Up
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
});

export default AuthScreen;
