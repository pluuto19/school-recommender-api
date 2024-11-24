import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { FlatList } from 'react-native';

const dummyFavorites = [
  { id: '1', name: 'Greenwood High School', location: 'California', rating: 4.5, fees: '$5000/year', facilities: ['Library', 'Sports Complex', 'Science Labs'] },
  { id: '2', name: 'Harmony International', location: 'Texas', rating: 4.7, fees: '$4500/year', facilities: ['Art Room', 'Music Room', 'Computer Labs'] },
];

const FavoritesScreen = ({ navigate }: { navigate: (screen: string, params?: any) => void }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Your Favorites
      </Text>

      <FlatList
        data={dummyFavorites}
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
      />

      <Button mode="outlined" onPress={() => navigate('Home')} style={styles.backButton}>
        Back to Home
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
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
});

export default FavoritesScreen;
