import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleError = (error) => {
  if (error.response) {
    const message = error.response.data?.detail || error.response.data?.message || 'Request failed.';
    throw new Error(message);
  }

  if (error.request) {
    throw new Error('No response received from the server.');
  }

  throw new Error(error.message || 'Unexpected error while processing the request.');
};

export const uploadScan = async (formData, { onUploadProgress, signal } = {}) => {
  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
      signal,
    });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getStatistics = async () => {
  try {
    const response = await api.get('/statistics');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const downloadReport = async (scanId) => {
  try {
    const response = await api.get(`/scan/${scanId}/report`, {
      responseType: 'blob',
    });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const downloadMask = async (scanId) => {
  try {
    const response = await api.get(`/scan/${scanId}/mask`, {
      responseType: 'blob',
    });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const downloadOverlay = async (scanId) => {
  try {
    const response = await api.get(`/scan/${scanId}/overlay`, {
      responseType: 'blob',
    });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export default api;