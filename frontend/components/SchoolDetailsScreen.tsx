import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { School } from './types';

const SchoolDetailsScreen = ({ route, navigate }: { route: any; navigate: (screen: string) => void }) => {
  const school: School | undefined = route?.params?.school;
  
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
        {school.name}
      </Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.detailText}>type: {school.type}</Text>
          <Text style={styles.detailText}>curriculum: {school.curriculum}</Text>
          <Text style={styles.detailText}>rating: {school.rating}</Text>
          <Text style={styles.detailText}>Annual tuition: ${school.tuition}</Text>
          <Text style={styles.detailText}>Focus: {school.focus}</Text>
          <Text style={styles.detailText}>Facilities: {school.facilities}</Text>
          <Text style={styles.detailText}>Student-Teacher Ratio: {school.student_teacher_ratio}:1</Text>
          <Text style={styles.detailText}>Test Scores: {school.test_scores}</Text>
        </Card.Content>
      </Card>

      <View style={styles.mapContainer}>
  <MapView
    provider={PROVIDER_GOOGLE}
    style={styles.map}
    initialRegion={{
      latitude: Number(school.latitude),
      longitude: Number(school.longitude),
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }}
    showsUserLocation={false}
    showsMyLocationButton={false}
    zoomEnabled={true}
    scrollEnabled={true}
  >
    <Marker
      coordinate={{
        latitude: Number(school.latitude),
        longitude: Number(school.longitude),
      }}
      title={school.name}
      description={`${school.type} - ${school.curriculum}`}
      pinColor="red"
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
    flex: 1,
    height: 300,
    width: '100%',
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    marginTop: 16,
  },
});

export default SchoolDetailsScreen;
