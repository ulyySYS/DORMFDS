import axios from 'axios';


const API_URL = 'http://localhost:3000';


export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/admin/account`, {
      email,
      password
    });
    return response.data;
  } catch (error) {

    if (error.response) {

      return error.response.data;
    } else {

      throw new Error('Network error occurred');
    }
  }
};