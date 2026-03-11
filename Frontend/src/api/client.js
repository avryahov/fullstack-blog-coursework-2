import axios from 'axios';

const API_URL = `${window.location.protocol}//${window.location.hostname}:3001/api`;

export const apiClient = axios.create({
  baseURL: API_URL,
});

export const createAuthorizedConfig = token => ({
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {},
});

export const getErrorMessage = error =>
  error.response?.data?.error || error.message || 'Что-то пошло не так. Попробуйте позднее.';
