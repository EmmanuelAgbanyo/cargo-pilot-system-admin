
// Auth utility functions

export const LOGIN_CREDENTIALS = {
  username: 'admin',
  password: 'password123'
};

export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem('user') !== null;
};

export const login = (username: string, password: string): boolean => {
  if (username === LOGIN_CREDENTIALS.username && password === LOGIN_CREDENTIALS.password) {
    sessionStorage.setItem('user', username);
    return true;
  }
  return false;
};

export const logout = (): void => {
  sessionStorage.removeItem('user');
};

export const getCurrentUser = (): string | null => {
  return sessionStorage.getItem('user');
};
