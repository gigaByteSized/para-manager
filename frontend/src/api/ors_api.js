import axios from 'axios';
import { baseAPI_URL } from './api_conf';

const API_URL = baseAPI_URL + '/directions';

export const getDirections = async (coordinates) => {
  try {
    const response = await axios.post(API_URL, { coordinates });
    return response.data;
  } catch (error) {
    console.error('Error fetching directions:', error);
    throw error;
  }
};
