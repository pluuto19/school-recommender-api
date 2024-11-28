import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api';

export const api = {
  login: async (username: string, password: string) => {
    try {
      console.log('Login Request:', { username, password });
      const response = await axios.post(`${API_URL}/auth/login`, { 
        username, 
        password 
      });
      console.log('Login Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  register: async (username: string, password: string, name: string) => {
    try {
      console.log('Register Request:', { username, password, name });
      const response = await axios.post(`${API_URL}/auth/register`, { 
        username, 
        password, 
        name 
      });
      console.log('Register Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Register Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  getSchools: async () => {
    const response = await axios.get(`${API_URL}/schools`);
    return response.data;
  }
}; 