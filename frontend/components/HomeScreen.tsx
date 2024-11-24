import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Card, Button } from 'react-native-paper';
import { FlatList } from 'react-native';
import Toast from 'react-native-toast-message';
import { useFavorites } from './FavoritesContext';
import { School } from './types';

const dummySchools: School[] = [
  {
    id: '1',
    name: 'Greenwood High School',
    location: 'California, USA',
    rating: 4.5,
    fees: 5000,
    facilities: ['Library', 'Sports Complex', 'Science Labs'],
  },
  {
    id: '2',
    name: 'Harmony International School',
    location: 'Texas, USA',
    rating: 4.7,
    fees: 4500,
    facilities: ['Art Room', 'Music Studio', 'Computer Labs'],
  },
  {
    id: '3',
    name: 'Starlight Academy',
    location: 'New York, USA',
    rating: 4.8,
    fees: 5500,
    facilities: ['Gymnasium', 'Swimming Pool', 'Robotics Lab'],
  },
  {
    id: '4',
    name: 'Riverside School',
    location: 'Florida, USA',
    rating: 4.6,
    fees: 5200,
    facilities: ['Playground', 'Auditorium', 'Smart Classrooms'],
  },
  {
    id: '5',
    name: 'Sunrise Elementary School',
    location: 'Seattle, USA',
    rating: 4.4,
    fees: 4800,
    facilities: ['Art Gallery', 'Science Park', 'Language Labs'],
  },
];
const HomeScreen = ({ navigate }: { navigate: (screen: string, params?: any) => void }) => {
  const { favorites, addFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [filteredSchools, setFilteredSchools] = useState(dummySchools);

  const handleSearch = (text: string) => {
    setQuery(text);
    setFilteredSchools(
      text.trim()
        ? dummySchools.filter((school) =>
            school.name.toLowerCase().includes(text.toLowerCase())
          )
        : dummySchools
    );
  };

  const addToFavorites = (school: School) => {
    if (favorites.some((fav) => fav.id === school.id)) {
      Toast.show({
        type: 'info',
        text1: 'Already Added',
        text2: `${school.name} is already in your favorites.`,
      });
      return;
    }

    addFavorite(school);
    Toast.show({
      type: 'success',
      text1: 'Added to Favorites',
      text2: `${school.name} has been added to your favorites.`,
    });
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

      <FlatList<School>
        data={filteredSchools}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          console.log('Rendering school:', item); // Debug log
          return(
          <Card style={styles.card}>
            <Card.Title title={item.name} subtitle={item.location} />
            <Card.Content>
              <Text>Rating: {item.rating}</Text>
            </Card.Content>
            <Card.Content>
              <Text>Fees: ${item.fees}</Text>
            </Card.Content>
            <Card.Content>
              <Text>Facilities: {item.facilities.join(', ')}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => {
                  console.log('Navigating to SchoolDetails with:', item); // Debug log
                  navigate('SchoolDetails', { school: item });
                }}
              >
                View Details
              </Button>
              <Button
                mode="outlined"
                onPress={() => addToFavorites(item)}
              >
                Add to Favorites
              </Button>
            </Card.Actions>
          </Card>
        );
        }}
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
  card: {
    marginBottom: 16,
  },
  favoritesButton: {
    marginTop: 16,
  },
});

export default HomeScreen;
