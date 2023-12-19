import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

export class UnauthorizedError extends Error {
  name = 'Unauthorized Error';
}

async function handleServerResponse(res) {
  const dataPromise = res.json();
  if (!res.ok) {
    const message = await dataPromise;
    toast.error(message);
    if (res.status === 401 || res.status === 403) {
      throw new UnauthorizedError();
    }
  }
  return dataPromise;
}

function getAuthHeader(token) {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

const commonHeaders = {
  'Content-type': 'application/json',
};

export function getApi(resource) {
  function post(body, options = {}) {
    options.body = JSON.stringify(body);
    options.headers = {
      ...options.headers,
      ...getAuthHeader(options.accessToken),
      ...commonHeaders,
    };
    options.method = 'POST';

    return fetch(`${apiUrl}/${resource}`, options).then(handleServerResponse);
  }

  function get(search = null, id = null, options = {}) {
    let searchStr = '';
    if (search) {
      searchStr = '?';
      searchStr += new URLSearchParams(search).toString();
    }

    options.headers = {
      ...options.headers,
      ...getAuthHeader(options.accessToken),
    };

    id = id !== null && id !== undefined ? `/${id}` : '';

    delete options.accessToken;

    return fetch(`${apiUrl}/${resource}${id}${searchStr}`, options).then(
      handleServerResponse
    );
  }

  function patch(id, body, options = {}) {
    options.body = JSON.stringify(body);
    options.headers = {
      ...options.headers,
      ...getAuthHeader(options.accessToken),
      ...commonHeaders,
    };
    options.method = 'PATCH';

    return fetch(`${apiUrl}/${resource}/${id}`, options).then(
      handleServerResponse
    );
  }

  function remove(id, options = {}) {
    options.method = 'DELETE';
    options.headers = {
      ...options.headers,
      ...getAuthHeader(options.accessToken),
    };

    return fetch(`${apiUrl}/${resource}/${id}`, options).then(
      handleServerResponse
    );
  }

  return {
    post,
    get,
    patch,
    remove,
  };
}
