import config from '@/config';
import axios from 'axios';

export const http = axios.create({
  baseURL: config.env.baseUrl,
});

/**
 * Sets the authorization token in the HTTP headers. If the token is null, it deletes the existing token.
 *
 * @param {string | null} token - The token to set in the headers. Defaults to null.
 * @return {void} This function does not return anything.
 */
export const setAuthToken = (token: string | null = null) => {
  if (!token) {
    delete http.defaults.headers.common['Authorization'];
  } else {
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

http.interceptors.request.use((config) => {
  return config;
});

http.interceptors.response.use((response) => {
  return response;
});

export default http;
