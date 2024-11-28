import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { School } from './types';

const SchoolDetailsScreen = ({ route, navigate }: { route: any; navigate: (screen: string) => void }) => {
  const school: School | undefined = route?.params?.school;

  console.log('School coordinates:', {
    latitude: school?.Latitude,
    longitude: school?.Longitude,
    name: school?.Name
  });

  if (!school) {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          No School Details Available
        </Text>
        <Button mode="outlined" onPress={() => navigate('Home')} style={styles.backButton}>
          Back to Home
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {school.Name}
      </Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.detailText}>Type: {school.Type}</Text>
          <Text style={styles.detailText}>Curriculum: {school.Curriculum}</Text>
          <Text style={styles.detailText}>Rating: {school.Rating}</Text>
          <Text style={styles.detailText}>Annual Tuition: ${school.Tuition}</Text>
          <Text style={styles.detailText}>Focus: {school.Focus}</Text>
          <Text style={styles.detailText}>Facilities: {school.Facilities}</Text>
          <Text style={styles.detailText}>Student-Teacher Ratio: {school['Student-Teacher Ratio']}:1</Text>
          <Text style={styles.detailText}>Test Scores: {school['Test Scores']}</Text>
        </Card.Content>
      </Card>

      <View style={styles.mapContainer}>
  <MapView
    provider={PROVIDER_GOOGLE}
    style={styles.map}
    initialRegion={{
      latitude: school.Latitude,
      longitude: school.Longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }}
  >
    <Marker
      coordinate={{
        latitude: school.Latitude,
        longitude: school.Longitude,
      }}
      title={school.Name}
      description={`${school.Type} - ${school.Curriculum}`}
    />
  </MapView>
</View>

      <Button 
        mode="outlined" 
        onPress={() => navigate('Home')} 
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
  detailText: {
    marginBottom: 8,
    fontSize: 16,
  },
  mapContainer: {
    height: 300,
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    marginTop: 16,
  },
});

export default SchoolDetailsScreen;
