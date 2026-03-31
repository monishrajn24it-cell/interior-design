import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE_URL}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const analyzeRoom = async (sessionId) => {
  const formData = new FormData();
  formData.append('session_id', sessionId);
  const response = await axios.post(`${API_BASE_URL}/analyze-room`, formData);
  return response.data;
};

export const generateDesigns = async (sessionId, style, intensity) => {
  const formData = new FormData();
  formData.append('session_id', sessionId);
  formData.append('style', style);
  formData.append('intensity', intensity);
  const response = await axios.post(`${API_BASE_URL}/generate-designs`, formData);
  return response.data;
};

export const optimizeLayout = async (sessionId) => {
  const formData = new FormData();
  formData.append('session_id', sessionId);
  const response = await axios.post(`${API_BASE_URL}/optimize-layout`, formData);
  return response.data;
};

export const predictBudget = async (sessionId, style) => {
  const formData = new FormData();
  formData.append('session_id', sessionId);
  formData.append('style', style);
  const response = await axios.post(`${API_BASE_URL}/predict-budget`, formData);
  return response.data;
};
