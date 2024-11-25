import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { FlatList } from 'react-native';
import { useFavorites } from './FavoritesContext';
import { School } from './types';

const FavoritesScreen = ({ navigate }: { navigate: (screen: string, params?: any) => void }) => {
  const { favorites } = useFavorites();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Your Favorites
      </Text>

      <FlatList<School>
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.name} subtitle={item.location} />
            <Card.Content>
              <Text>Rating: {item.rating}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => navigate('SchoolDetails', { school: item })}
              >
                View Details
              </Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No favorites added yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 16,
  },
});

export default FavoritesScreen;
