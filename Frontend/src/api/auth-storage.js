const AUTH_STORAGE_KEY = 'authData';

export const readAuthData = () => {
  const rawAuthData = sessionStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawAuthData) {
    return null;
  }

  try {
    return JSON.parse(rawAuthData);
  } catch (_error) {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    return null;
  }
};

export const saveAuthData = token => {
  sessionStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      token,
    })
  );
};

export const clearAuthData = () => {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
};
