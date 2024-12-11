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
  route?: { params?: { user?: { name: string, _id: string } } }
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
            school.name.toLowerCase().includes(text.toLowerCase())
          )
        : schools
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

  const handleSchoolView = async (school: School) => {
    try {
      if (route?.params?.user?._id) {
        await api.updateUserInteraction(
          {
            userId: route.params.user._id,
            school_name: school.name,
            interactionType: 'view'
          }
        );
      }
    } catch (error) {
      console.error('Failed to update view interaction:', error);
    }
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
        <TouchableOpacity 
          onPress={() => navigate('Recommendations', { user: route?.params?.user })} 
          style={styles.recommendButton}
        >
          <Text style={styles.recommendText}>Recommendations</Text>
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
            <Card.Title title={item.name} subtitle={`${item.type} - ${item.curriculum}`} />
            <Card.Content>
              <Text>Rating: {item.rating}</Text>
              <Text>Tuition: ${item.tuition}</Text>
              <Text>Focus: {item.focus}</Text>
              <Text>Facilities: {item.facilities}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => {
                  handleSchoolView(item);
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
  recommendButton: {
    marginRight: 16,
    backgroundColor: '#5612cc',
    padding: 8,
    borderRadius: 4,
  },
  recommendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
