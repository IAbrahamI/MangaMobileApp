// api/api.js
import axios from 'axios';

// Create an Axios instance with the base URL of your FastAPI backend
const axiosInstance = axios.create({
  baseURL: 'https://mangaapi.aby-host-network.duckdns.org', 
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
    const response = await axiosInstance.post(url);
    return response.data;
  } catch (error) {
    console.error('Error adding manga:', error);
    throw error;
  }
};

export const removeManga = async (manga_name) => {
  try {
    const url = `/mangas/${manga_name}`; // Construct the URL
    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    console.error('Error removing manga:', error);
    throw error;
  }
};

export const updateMangas = async () => {
  try {
    const response = await axiosInstance.put('/mangas');
    return response.data;
  } catch (error) {
    console.error('Error fetching mangas:', error);
    throw error;
  }
};

