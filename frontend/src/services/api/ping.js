import api from './index';

export const pingServer = () => api.get('/ping').then(res => res.data);
export const ping = async () => {
  try {
    const response = await api.get('/ping');
    return response.data;
  } catch (error) {
    console.error('Ping failed:', error);
    throw error;
  }
};
export const pingWithTimeout = async (timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Ping timed out'));
    }, timeout);

    ping()
      .then(data => {
        clearTimeout(timer);
        resolve(data);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
};