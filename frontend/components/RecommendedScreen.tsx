import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, Appbar, ActivityIndicator } from 'react-native-paper';
import { FlatList } from 'react-native';
import { School } from './types';
import { api } from '../services/api';
import Toast from 'react-native-toast-message';
import { useUser } from './UserContext';

interface RecommendedScreenProps {
  navigate: (screen: string, params?: any) => void;
  route?: {
    params?: {
      user?: {
        _id?: string;
        name?: string;
      };
    };
  };
}

const RecommendedScreen: React.FC<RecommendedScreenProps> = ({ navigate, route }) => {
  const [recommendations, setRecommendations] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const fetchRecommendations = async () => {
    if (!user?._id) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User ID not found. Please log in again.',
      });
      navigate('Auth');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getRecommendations(user._id);
      const validRecommendations = (response || []).map(school => ({
        id: school.id || String(Math.random()),
        name: school.Name || 'Unknown School',
        type: school.Type || 'N/A',
        curriculum: school.Curriculum || 'N/A',
        rating: school.Rating || 'N/A',
        tuition: typeof school.Tuition === 'number' ? school.Tuition : null,
        focus: school.Focus || 'N/A',
        facilities: school.Facilities || 'N/A',
        studentTeacherRatio: school['Student-Teacher Ratio'] || 'N/A',
        testScores: school['Test Scores'] || 'N/A',
        location: {
          latitude: school.Latitude || 0,
          longitude: school.Longitude || 0
        },
        similarityScore: school.similarity_score || 0
      }));

      setRecommendations(validRecommendations);
      
      if (!validRecommendations.length) {
        setError('No recommendations available');
        Toast.show({
          type: 'info',
          text1: 'Notice',
          text2: 'No recommendations available yet. Try exploring more schools!',
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Found ${validRecommendations.length} recommended schools`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recommendations';
      setError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (school: School) => {
    try {
      if (!user?._id) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please log in to view school details',
        });
        navigate('Auth');
        return;
      }

      setLoading(true);
      await api.updateUserInteraction({
        userId: user._id,
        school_name: school.name,
        interactionType: 'view'
      });
      
      navigate('SchoolDetails', { school });
    } catch (error) {
      console.error('Failed to record interaction:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to record interaction. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user?._id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6815ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Recommended Schools" />
        <Appbar.Action icon="refresh" onPress={fetchRecommendations} />
        <Appbar.Action icon="home" onPress={() => navigate('Home')} />
      </Appbar.Header>

      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title 
              title={item.name} 
              subtitle={`${item.type || 'N/A'} ${item.curriculum ? `- ${item.curriculum}` : ''}`} 
            />
            <Card.Content>
              <Text>Rating: {item.rating || 'N/A'}</Text>
              <Text>Tuition: {item.tuition ? `$${item.tuition.toLocaleString()}` : 'N/A'}</Text>
              <Text>Focus: {item.focus || 'N/A'}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => handleViewDetails(item)}
              >
                View Details
              </Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {error || 'No recommendations available. Try exploring more schools!'}
            </Text>
            <Button 
              mode="contained" 
              onPress={fetchRecommendations}
              style={styles.retryButton}
            >
              Retry
            </Button>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#6815ff',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    margin: 16,
    color: 'gray',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 10,
  }
});

export default RecommendedScreen; 