import { API_BASE, API_TIMEOUT } from './config';

const normalizeEndpoint = (endpoint) => {
  // Elimina barras iniciales duplicadas
  return endpoint.replace(/^\/*/, '');
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Error en la solicitud');
  }
  return response.json();
};

const fetchWithTimeout = (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  const url = `${API_BASE}/${normalizeEndpoint(endpoint)}`;
  console.log('Real request to:', url); // Para depuración

  return fetch(url, {
    ...options,
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  }).finally(() => clearTimeout(timeoutId));
};

export const api = {
  get: (endpoint) => fetchWithTimeout(endpoint).then(handleResponse),
  post: (endpoint, data) => fetchWithTimeout(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(handleResponse),
  put: (endpoint, data) => fetchWithTimeout(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }).then(handleResponse),
  delete: (endpoint) => fetchWithTimeout(endpoint, {
    method: 'DELETE',
  }).then(handleResponse),
};