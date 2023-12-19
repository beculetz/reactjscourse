import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';

const initialAuth = {
  accessToken: null,
  user: null,
};

const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
  const [auth, setAuth] = useLocalStorageState('auth', initialAuth);

  const login = useCallback(
    (data) => {
      setAuth(data);
    },
    [setAuth]
  );

  const logout = useCallback(() => {
    setAuth(initialAuth);
  }, [setAuth]);

  const value = useMemo(() => {
    return { ...auth, login, logout };
  }, [auth, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error(
      'Please only use useAuthContext inside a descendant of AuthContextProvider.'
    );
  }
  return ctx;
}
