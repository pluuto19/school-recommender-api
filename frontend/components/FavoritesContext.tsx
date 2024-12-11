import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { School } from './types';
import { api } from '../services/api';

interface FavoritesContextType {
  favorites: School[];
  addFavorite: (school: School) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<School[]>([]);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };
    loadFavorites();
  }, []);

  const addFavorite = async (school: School) => {
    if (!favorites.some((fav) => fav.id === school.id)) {
      const newFavorites = [...favorites, school];
      setFavorites(newFavorites);
      
      try {
        // Save to AsyncStorage
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
        
        // Get user from AsyncStorage
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          if (user._id) {
            await api.updateUserInteraction({
              userId: user._id,
              school_name: school.name,
              interactionType: 'favorite'
            });
          }
        }
      } catch (error) {
        console.error('Failed to update favorite:', error);
      }
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
