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
import { FavoritesProvider } from './components/FavoritesContext';
import RecommendedScreen from './components/RecommendedScreen';
import { UserProvider } from './components/UserContext';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Welcome');
  const [currentRoute, setCurrentRoute] = useState<any>(null);

  const navigate = (screen: string, params?: any) => {
    setCurrentScreen(screen);
    setCurrentRoute(params || null);
  };

  return (
    <UserProvider>
      <FavoritesProvider>
        <SafeAreaProvider>
          <PaperProvider>
            <View style={styles.container}>
              {currentScreen === 'Welcome' && <WelcomeScreen navigate={navigate} />}
              {currentScreen === 'Auth' && <AuthScreen navigate={navigate} />}
              {currentScreen === 'SignUp' && <SignUpScreen navigate={navigate} />}
              {currentScreen === 'Home' && (
                <HomeScreen 
                  navigate={navigate} 
                  route={{ params: currentRoute }}
                />
              )}
              {currentScreen === 'SchoolDetails' && (
                <SchoolDetailsScreen route={{ params: currentRoute }} navigate={navigate} />
              )}
              {currentScreen === 'Favorites' && (
                <FavoritesScreen navigate={navigate} currentRoute={currentRoute} />
              )}
              {currentScreen === 'Recommendations' && (
                <RecommendedScreen 
                  navigate={navigate} 
                  route={{ params: currentRoute }}
                />
              )}
            </View>
            <Toast />
          </PaperProvider>
        </SafeAreaProvider>
      </FavoritesProvider>
      <Toast 
        position='top'
        topOffset={60}
      />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
