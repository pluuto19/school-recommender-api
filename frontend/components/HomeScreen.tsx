import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Card, Button } from 'react-native-paper';
import { FlatList } from 'react-native';

const dummySchools = [
  { id: '1', name: 'Greenwood High School', location: 'California', rating: 4.5, fees: '$5000/year', facilities: ['Library', 'Sports Complex', 'Science Labs'] },
  { id: '2', name: 'Harmony International', location: 'Texas', rating: 4.7, fees: '$4500/year', facilities: ['Art Room', 'Music Room', 'Computer Labs'] },
  { id: '3', name: 'Starlight Academy', location: 'New York', rating: 4.8, fees: '$5500/year', facilities: ['Gym', 'Swimming Pool', 'Robotics Labs'] },
];

const HomeScreen = ({ navigate }: { navigate: (screen: string, params?: any) => void }) => {
  const [query, setQuery] = useState('');
  const [filteredSchools, setFilteredSchools] = useState(dummySchools);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === '') {
      setFilteredSchools(dummySchools);
    } else {
      setFilteredSchools(
        dummySchools.filter((school) =>
          school.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Welcome, Admin!
      </Text>

      <TextInput
        label="Search schools"
        value={query}
        onChangeText={handleSearch}
        mode="outlined"
        style={styles.searchBar}
      />

      <Text variant="titleLarge" style={styles.sectionTitle}>
        Recommended Schools
      </Text>

      <FlatList
        data={filteredSchools}
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

      <Button
        mode="contained"
        style={styles.favoritesButton}
        onPress={() => navigate('Favorites')}
      >
        Go to Favorites
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
  header: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  searchBar: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  favoritesButton: {
    marginTop: 16,
  },
});

export default HomeScreen;
