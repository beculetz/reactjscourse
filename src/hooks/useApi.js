import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { useAuthContext } from '../features/Auth/AuthContext';
import { UnauthorizedError, getApi } from '../utils/api';

async function makeRequest(apiFunc, logout, navigate, pathname, args) {
  let result;
  try {
    result = await apiFunc(...args);
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      logout();
      navigate('/login', { state: { from: pathname } });
      return;
    }
    console.warn(e);
  }

  return result;
}

export function useApi(resource) {
  const {
    get: apiGet,
    post: apiPost,
    patch: apiPatch,
    remove: apiRemove,
  } = useMemo(() => getApi(resource), [resource]);

  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const get = useCallback(
    async (...args) => {
      return makeRequest(apiGet, logout, navigate, pathname, args);
    },
    [logout, navigate, pathname, apiGet]
  );

  const post = useCallback(
    async (...args) => {
      return makeRequest(apiPost, logout, navigate, pathname, args);
    },
    [logout, navigate, pathname, apiPost]
  );

  const patch = useCallback(
    async (...args) => {
      return makeRequest(apiPatch, logout, navigate, pathname, args);
    },
    [logout, navigate, pathname, apiPatch]
  );

  const remove = useCallback(
    async (...args) => {
      return makeRequest(apiRemove, logout, navigate, pathname, args);
    },
    [logout, navigate, pathname, apiRemove]
  );

  return { get, post, patch, remove };
}
