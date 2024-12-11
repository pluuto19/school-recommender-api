import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, Appbar } from 'react-native-paper';
import { FlatList } from 'react-native';
import { useFavorites } from './FavoritesContext';
import { School } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface FavoritesScreenProps {
  navigate: (screen: string, params?: any) => void;
  currentRoute: any;
}

const FavoritesScreen = ({ navigate, currentRoute }: FavoritesScreenProps) => {
  const { favorites } = useFavorites();

  const handleViewDetails = async (school: School) => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        if (user._id) {
          await api.updateUserInteraction({
            userId: user._id,
            school_name: school.name,
            interactionType: 'view'
          });
        }
      }
      navigate('SchoolDetails', { school });
    } catch (error) {
      console.error('Failed to record interaction:', error);
      navigate('SchoolDetails', { school });
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Your Favorites" />
      </Appbar.Header>

      <FlatList<School>
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.name} subtitle={item.type} />
            <Card.Content>
              <Text>Rating: {item.rating}</Text>
            </Card.Content>
            <Card.Actions>
            <Button
  mode="contained"
  onPress={() => handleViewDetails(item)}
>
  View Details
</Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No favorites added yet.</Text>}
      />
      
      <Button 
        mode="outlined" 
        onPress={() => navigate('Home', { user: currentRoute?.params?.user })} 
        style={styles.backButton}
      >
        Back to Home
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#6815ff',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 16,
  },
  backButton: {
    margin: 16,
  }
});

export default FavoritesScreen;
