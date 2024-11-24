import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WelcomeScreen from './components/WelcomeScreen';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import SignUpScreen from './components/SingUpScreen';
import SchoolDetailsScreen from './components/SchoolDetailsScreen';
import FavoritesScreen from './components/FavoriteScreen';
import Toast from 'react-native-toast-message';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Welcome');
  const [currentRoute, setCurrentRoute] = useState<any>(null); // Store route params

  const navigate = (screen: string, params?: any) => {
    setCurrentScreen(screen);
    setCurrentRoute(params || null); // Store params for the next screen
  };

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={styles.container}>
          {currentScreen === 'Welcome' && <WelcomeScreen navigate={navigate} />}
          {currentScreen === 'Auth' && <AuthScreen navigate={navigate} />}
          {currentScreen === 'SignUp' && <SignUpScreen navigate={navigate} />}
          {currentScreen === 'Home' && <HomeScreen navigate={navigate} />}
          {currentScreen === 'SchoolDetails' && (
            <SchoolDetailsScreen route={{ params: currentRoute }} navigate={navigate} />
          )}
          {currentScreen === 'Favorites' && <FavoritesScreen navigate={navigate} />}
        </View>
        <Toast />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
