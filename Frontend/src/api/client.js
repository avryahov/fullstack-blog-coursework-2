import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || `${window.location.protocol}//${window.location.hostname}:3001/api`;

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

const DEFAULT_STATUS_MESSAGES = {
  400: 'Проверьте корректность введенных данных.',
  401: 'Нужна авторизация.',
  403: 'Недостаточно прав для этого действия.',
  404: 'Запрошенные данные не найдены.',
  409: 'Не удалось выполнить запрос из-за конфликта данных.',
  500: 'Не удалось выполнить запрос. Попробуйте позднее.',
};

export const getErrorMessage = error => {
  const backendMessage = error.response?.data?.error;
  const statusCode = error.response?.status;

  if (backendMessage) {
    return backendMessage;
  }

  if (statusCode && DEFAULT_STATUS_MESSAGES[statusCode]) {
    return DEFAULT_STATUS_MESSAGES[statusCode];
  }

  return error.message || 'Что-то пошло не так. Попробуйте позднее.';
};
