import axios from 'axios';
import { API_URL } from '../utils/constants'

const axiosAuthorization = axios.create({
    baseURL: `${API_URL}`,
  });

  export const setAuthToken = (token) => {
    if (token) {
        axiosAuthorization.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosAuthorization.defaults.headers.common['Authorization'];
    }
  };
  
  export default axiosAuthorization;
