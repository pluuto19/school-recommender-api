import 'react-native-gesture-handler'; // This must be at the top for React Navigation to work properly
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Animated, ImageBackground, FlatList } from 'react-native';
import MapView from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';

// Your component code follows


type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  SchoolList: undefined;
  SchoolDetails: { school: School };
};

type School = {
  id: string;
  name: string;
  admissionFee: string;
  level: string;
  monthlyFee: string;
  transport: string;
};

type SchoolDetailsScreenRouteProp = RouteProp<RootStackParamList, 'SchoolDetails'>;

type SchoolDetailsScreenProps = {
  route: SchoolDetailsScreenRouteProp;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

type WelcomeScreenProps = {
  navigation: NavigationProp;
};

type LoginScreenProps = {
  navigation: NavigationProp;
};

type SignupScreenProps = {
  navigation: NavigationProp;
};

type HomeScreenProps = {
  navigation: NavigationProp;
};

type SchoolListScreenProps = {
  navigation: NavigationProp;
};

const Stack = createStackNavigator<RootStackParamList>();

// Welcome Screen Component with Animation
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <ImageBackground source={require('./assets/welcome-bg.jpg')} style={styles.backgroundImage}>
      <View style={styles.containerWithHeader}>
        <Animated.View style={[styles.welcomeContainer, { opacity: fadeAnim }]}>
          <Text style={styles.welcomeTitle}>Welcome to School Recommendation System</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.buttonTextSecondary}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

// Login Screen Component
const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ImageBackground source={require('./assets/login-bg.jpg')} style={styles.backgroundImage}>
      <View style={styles.containerWithHeader}>
        <Text style={styles.header}>School Recommendation System</Text>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

// Signup Screen Component
const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <ImageBackground source={require('./assets/signup-bg.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.containerWithHeader}>
        <Text style={styles.header}>School Recommendation System</Text>
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Zipcode"
            value={zipcode}
            onChangeText={(text) => setZipcode(text)}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={(text) => setAddress(text)}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

// Home Screen Component
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <ImageBackground source={require('./assets/home-bg.jpg')} style={styles.backgroundImage}>
      <View style={styles.containerWithHeader}>
        <Text style={styles.header}>School Recommendation System</Text>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SchoolList')}>
            <Text style={styles.buttonText}>View Schools List</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

// School List Screen Component
const SchoolListScreen: React.FC<SchoolListScreenProps> = ({ navigation }) => {
  const schools: School[] = [
    { id: '1', name: 'Green Valley High School', admissionFee: '$500', level: 'High School', monthlyFee: '$300', transport: 'Available' },
    { id: '2', name: 'Sunrise Elementary School', admissionFee: '$300', level: 'Elementary', monthlyFee: '$200', transport: 'Not Available' },
    { id: '3', name: 'Hillside Academy', admissionFee: '$700', level: 'Middle School', monthlyFee: '$400', transport: 'Available' },
  ];

  return (
    <ImageBackground source={require('./assets/school-list-bg.jpg')} style={styles.backgroundImage}>
      <View style={styles.containerWithHeader}>
        <Text style={styles.header}>School Recommendation System</Text>
        <View style={styles.container}>
          <FlatList
            data={schools}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('SchoolDetails', { school: item })}>
                <Text style={styles.listItemText}>{item.name}</Text>
                <Text>Admission Fee: {item.admissionFee}</Text>
                <Text>Level: {item.level}</Text>
                <Text>Monthly Fee: {item.monthlyFee}</Text>
                <Text>Transport: {item.transport}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

// School Details Screen Component
const SchoolDetailsScreen: React.FC<SchoolDetailsScreenProps> = ({ route }) => {
  const { school } = route.params;
  return (
    <ImageBackground source={require('./assets/school-details-bg.jpg')} style={styles.backgroundImage}>
      <View style={styles.containerWithHeader}>
        <Text style={styles.header}>School Recommendation System</Text>
        <View style={styles.container}>
          <Text style={styles.schoolTitle}>{school.name}</Text>
          <Text style={styles.schoolDetails}>Admission Fee: {school.admissionFee}</Text>
          <Text style={styles.schoolDetails}>Level: {school.level}</Text>
          <Text style={styles.schoolDetails}>Monthly Fee: {school.monthlyFee}</Text>
          <Text style={styles.schoolDetails}>Transport Availability: {school.transport}</Text>
          <Text style={styles.schoolDetails}>Transport Availability: {school.transport}</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SchoolList" component={SchoolListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SchoolDetails" component={SchoolDetailsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  containerWithHeader: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#4CAF50',
    padding: 15,
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginBottom: 10,
  },
  buttonTextSecondary: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 10,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItemText: {
    fontSize: 18,
    color: '#333',
  },
  schoolTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  schoolDetails: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 15,
  },
});

export default App;

