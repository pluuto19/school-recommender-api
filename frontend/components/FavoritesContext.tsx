import React, { createContext, useState, useContext } from 'react';
import { School } from './types'; // Import the School type

interface FavoritesContextType {
  favorites: School[];
  addFavorite: (school: School) => void;
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

  const addFavorite = (school: School) => {
    if (!favorites.some((fav) => fav.id === school.id)) {
      setFavorites([...favorites, school]);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
