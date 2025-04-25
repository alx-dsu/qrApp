const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// if (!API_BASE_URL) {
//   console.warn('EXPO_PUBLIC_API_URL no está definido en las variables de entorno');
// }

export const API_BASE = API_BASE_URL || "http://172.16.1.154:8000/api/sci";
export const API_TIMEOUT = 15000;