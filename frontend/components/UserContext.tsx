import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  _id: string;
  name: string;
  username: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    // Load user data on app start
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUserState(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    loadUser();
  }, []);

  const setUser = async (newUser: User | null) => {
    try {
      if (newUser) {
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
      } else {
        await AsyncStorage.removeItem('user');
      }
      setUserState(newUser);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUserState(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}; 