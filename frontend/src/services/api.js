import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getCandidates = async () => {
  const response = await api.get('/candidates');
  return response.data;
};

export const addCandidate = async (candidateData) => {
  const response = await api.post('/candidates', candidateData);
  return response.data;
};

export const toggleSaveCandidate = async (id) => {
  const response = await api.put(`/candidates/${id}/save`);
  return response.data;
};

export const matchCandidates = async (jobData) => {
  const response = await api.post('/match', jobData);
  return response.data;
};

export const shortlistAI = async (data) => {
  const response = await api.post('/ai/shortlist', data);
  return response.data;
};

export default api;
