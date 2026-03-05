import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const API_BASE_URL = API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  getAuthUrl: () => api.get('/auth/login'),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
};

export const emotionAPI = {
  analyzeTopTracks: (timeRange = 'medium_term', limit = 50) =>
    api.get(`/emotion/analyze/top-tracks?timeRange=${timeRange}&limit=${limit}`),
  analyzeCompleteProfile: () =>
    api.post('/emotion/analyze/profile'),
  analyzeTrack: (trackId: string) =>
    api.get(`/emotion/analyze/track/${trackId}`),
  getUserAnalyses: (limit = 50) =>
    api.get(`/emotion/analyses?limit=${limit}`),
  getEmotionDistribution: () =>
    api.get('/emotion/distribution'),
  getInsights: () =>
    api.get('/emotion/insights'),
  getEmotionReport: () =>
    api.get('/emotion/report'),
};

export const tracksAPI = {
  getTopTracks: (timeRange = 'medium_term', limit = 50) =>
    api.get(`/tracks/top?timeRange=${timeRange}&limit=${limit}`),
  getRecentlyPlayed: (limit = 50) =>
    api.get(`/tracks/recent?limit=${limit}`),
  searchTracks: (query: string, limit = 20) =>
    api.get(`/tracks/search?q=${encodeURIComponent(query)}&limit=${limit}`),
  getTrack: (trackId: string) =>
    api.get(`/tracks/${trackId}`),
  getAudioFeatures: (trackId: string) =>
    api.get(`/tracks/${trackId}/features`),
};

export const playlistAPI = {
  getUserPlaylists: () =>
    api.get('/playlists'),
  createEmotionPlaylist: (data: {
    emotion: string;
    name: string;
    description?: string;
    trackCount?: number;
  }) => api.post('/playlists/create-emotion', data),
  getRecommendations: (emotion?: string, limit = 20) =>
    api.get(`/playlists/recommendations?emotion=${emotion || ''}&limit=${limit}`),
};

export const userAPI = {
  getProfile: () =>
    api.get('/user/profile'),
  getListeningHistory: (limit = 100) =>
    api.get(`/user/history?limit=${limit}`),
  findCompatibleUsers: (limit = 10) =>
    api.get(`/user/compatible?limit=${limit}`),
  getConnections: (status = 'accepted') =>
    api.get(`/user/connections?status=${status}`),
};

export default api;
