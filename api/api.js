// api/api.js
import axios from 'axios';

// Create an Axios instance with the base URL of your FastAPI backend
const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.125:8000', // Replace with your FastAPI backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to fetch all mangas
export const fetchMangas = async () => {
  try {
    const response = await axiosInstance.get('/mangas');
    return response.data;
  } catch (error) {
    console.error('Error fetching mangas:', error);
    throw error;
  }
};

export const addManga = async (manga_name) => {
  try {
    const url = `/mangas/${manga_name}`; // Construct the URL
    console.log(`Making POST request to: ${axiosInstance.defaults.baseURL}${url}`); // Log the full URL
    const response = await axiosInstance.post(url);
    return response.data;
  } catch (error) {
    console.error('Error adding manga:', error);
    throw error;
  }
};


