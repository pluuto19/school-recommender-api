import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image,TouchableOpacity } from 'react-native';
import { Appbar,Text, TextInput, Card, Button } from 'react-native-paper';
import { FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Toast from 'react-native-toast-message';
import { useFavorites } from './FavoritesContext';
import { School } from './types';
import { api } from '../services/api';

const HomeScreen = ({ navigate, route }: { 
  navigate: (screen: string, params?: any) => void,
  route?: { params?: { user?: { name: string } } }
}) => {
  const { favorites, addFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const userName = route?.params?.user?.name || 'Guest';

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await api.getSchools();
        setSchools(data);
        setFilteredSchools(data);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch schools',
        });
      }
    };
    fetchSchools();
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);
    setFilteredSchools(
      text.trim()
        ? schools.filter((school) =>
            school.Name.toLowerCase().includes(text.toLowerCase())
          )
        : schools
    );
  };

  const addToFavorites = (school: School) => {
    if (favorites.some((fav) => fav.id === school.id)) {
      Toast.show({
        type: 'info',
        text1: 'Already Added',
        text2: `${school.Name} is already in your favorites.`,
      });
      return;
    }

    addFavorite(school);
    Toast.show({
      type: 'success',
      text1: 'Added to Favorites',
      text2: `${school.Name} has been added to your favorites.`,
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
          title={`Welcome ${userName}`} 
          titleStyle={styles.headerTitle}
        />
        <TouchableOpacity 
          onPress={() => navigate('Favorites', { user: route?.params?.user })} 
          style={styles.favoritesButton}
        >
          <Text style={styles.favoritesText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleLogout} 
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
            <Card.Title title={item.Name} subtitle={`${item.Type} - ${item.Curriculum}`} />
            <Card.Content>
              <Text>Rating: {item.Rating}</Text>
              <Text>Tuition: ${item.Tuition}</Text>
              <Text>Focus: {item.Focus}</Text>
              <Text>Facilities: {item.Facilities}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => {
                  console.log('Navigating to school:', {
                    name: item.Name,
                    lat: item.Latitude,
                    lng: item.Longitude
                  });
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
            coordinate={{ latitude: school.Latitude, longitude: school.Longitude }}
            title={school.Name}
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
  logoutButton: {
    marginRight: 16,
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
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
  favoritesButton: {
    marginRight: 16,
    backgroundColor: '#5612cc',
    padding: 8,
    borderRadius: 4,
  },
  favoritesText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
