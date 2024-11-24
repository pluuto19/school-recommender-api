import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Appbar,Text, TextInput, Card, Button } from 'react-native-paper';
import { FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    id: '2',
    name: 'Harmony International School',
    location: 'Texas, USA',
    rating: 4.7,
    fees: 4500,
    facilities: ['Art Room', 'Music Studio', 'Computer Labs'],
    latitude: 29.7604,
    longitude: -95.3698,
  },
  {
    id: '3',
    name: 'Starlight Academy',
    location: 'New York, USA',
    rating: 4.8,
    fees: 5500,
    facilities: ['Gymnasium', 'Swimming Pool', 'Robotics Lab'],
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: '4',
    name: 'Riverside School',
    location: 'Florida, USA',
    rating: 4.6,
    fees: 5200,
    facilities: ['Playground', 'Auditorium', 'Smart Classrooms'],
    latitude: 27.9944,
    longitude: -81.7603,
  },
  {
    id: '5',
    name: 'Sunrise Elementary School',
    location: 'Seattle, USA',
    rating: 4.4,
    fees: 4800,
    facilities: ['Art Gallery', 'Science Park', 'Language Labs'],
    latitude: 47.6062,
    longitude: -122.3321,
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
  const handleLogout = () => {
    navigate('Auth');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title={`Welcome, Admin`}
          titleStyle={styles.headerTitle}
        />
        <Appbar.Action
          icon="logout"
          onPress={handleLogout}
          color='#fff'
          accessibilityLabel="Logout Button"
        />
      </Appbar.Header>

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
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.name} subtitle={item.location} />
            <Card.Content>
              <Text>Rating: {item.rating}</Text>
              <Text>Fees: ${item.fees}</Text>
              <Text>Facilities: {item.facilities.join(', ')}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => navigate('SchoolDetails', { school: item })}
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
        )}
      />

      {/* Map Section */}
      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.7749,
          longitude: -95.7129,
          latitudeDelta: 20,
          longitudeDelta: 20,
        }}
      > */}
        {filteredSchools.map((school) => (
          <Marker
            key={school.id}
            coordinate={{ latitude: school.latitude, longitude: school.longitude }}
            title={school.name}
            description={school.location}
          />
        ))}
      {/* </MapView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#6815ff', // Change color as needed
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  searchBar: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  card: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  map: {
    flex: 1,
    margin: 16,
    height: Dimensions.get('window').height / 3, // Show 1/3rd of the screen
  },
});

export default HomeScreen;
