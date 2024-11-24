import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // Add this import
import WelcomeScreen from './components/WelcomeScreen';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Welcome');

  const navigate = (screen: string) => setCurrentScreen(screen);

  return (
    <SafeAreaProvider> {/* Wrap with SafeAreaProvider */}
      <PaperProvider>
        <View style={styles.container}>
          {currentScreen === 'Welcome' && <WelcomeScreen navigate={navigate} />}
          {currentScreen === 'Auth' && <AuthScreen navigate={navigate} />}
          {currentScreen === 'Home' && <HomeScreen navigate={navigate} />}
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
