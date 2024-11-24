import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Card } from 'react-native-paper';
import { FlatList } from 'react-native';

const dummySchools = [
  { id: '1', name: 'Greenwood High School' },
  { id: '2', name: 'Starlight Academy' },
  { id: '3', name: 'Harmony International' },
];

const HomeScreen = ({ navigate: _navigate }: { navigate: (screen: string) => void }) => {
  const [query, setQuery] = useState('');

  const filteredSchools = dummySchools.filter((school) =>
    school.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Discover Schools
      </Text>
      <TextInput
        label="Search schools"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <FlatList
        data={filteredSchools}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => console.log(`Viewing ${item.name}`)}>
            <Card.Content>
              <Text variant="titleMedium">{item.name}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
});

export default HomeScreen;
