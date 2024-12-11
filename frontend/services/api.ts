import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api';

export const api = {
  login: async (username: string, password: string) => {
    try {
      console.log('🔑 Login attempt:', { username });
      const response = await axios.post(`${API_URL}/auth/login`, { 
        username, 
        password 
      });
      console.log('✅ Login successful');
      return response.data;
    } catch (error: any) {
      console.error('❌ Login Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  register: async (username: string, password: string, name: string) => {
    try {
      console.log('📝 Register attempt:', { username, name });
      const response = await axios.post(`${API_URL}/auth/register`, { 
        username, 
        password, 
        name 
      });
      console.log('✅ Registration successful');
      return response.data;
    } catch (error: any) {
      console.error('❌ Register Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  getSchools: async () => {
    try {
      console.log('🏫 Fetching schools list');
      const response = await axios.get(`${API_URL}/schools`);
      console.log(`✅ Retrieved ${response.data.length} schools`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching schools:', error);
      throw error;
    }
  },

  getRecommendations: async (userId: string) => {
    try {
      console.log('🎯 Fetching recommendations for user:', userId);
      const response = await fetch(`${API_URL}/recommendations/${userId}`);
      const data = await response.json();
      console.log('🔍 Response:', data.recommendations);
      if (data.success && data.recommendations) {
        console.log(`✅ Retrieved ${data.recommendations.length} recommendations`);
        return data.recommendations;
      } else {
        console.log('❌ No recommendations:', data.message);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching recommendations:', error);
      throw error;
    }
  },

  updateUserInteraction: async (data: {
    userId: string;
    school_name: string;
    interactionType: string;
  }) => {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        console.log('👆 Recording user interaction:', {
          userId: data.userId,
          school_name: data.school_name,
          type: data.interactionType
        });
        
        const response = await axios.post(`${API_URL}/user/interactions`, {
          userId: data.userId,
          school_name: data.school_name,
          type: data.interactionType
        }, {
          timeout: 5000, // 5 second timeout
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('✅ Interaction recorded successfully:', response.data);
        return response.data;
      } catch (error) {
        attempt++;
        console.error(`❌ Error recording interaction (attempt ${attempt}/${maxRetries}):`, error);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}; 