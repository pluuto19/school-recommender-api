import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

const SchoolDetailsScreen = ({ route, navigate }: { route: any; navigate: (screen: string) => void }) => {
  const { school } = route.params || {}; // Safeguard against undefined params

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
          <Text>Location: {school.location}</Text>
          <Text>Rating: {school.rating}</Text>
          <Text>Fees: {school.fees}</Text>
          <Text>Facilities:</Text>
          {school.facilities.map((facility: string, index: number) => (
            <Text key={index}>- {facility}</Text>
          ))}
        </Card.Content>
      </Card>
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
    padding: 16,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
});

export default SchoolDetailsScreen;
