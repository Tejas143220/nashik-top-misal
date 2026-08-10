import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchShops = async (params) => {
  const { data } = await api.get('/shops/', { params });
  return data;
};

export const createShop = async (shopData) => {
  const { data } = await api.post('/shops/', shopData);
  return data;
};

export const fetchShopBySlug = async (slug) => {
  const { data } = await api.get(`/shops/${slug}`);
  return data;
};

export const fetchShopSchema = async (slug) => {
  const { data } = await api.get(`/shops/${slug}/schema`);
  return data;
};

export const fetchAreas = async () => {
  const { data } = await api.get('/shops/areas');
  return data;
};

export const fetchActivities = async () => {
  const { data } = await api.get('/activities/');
  return data;
};

export const submitReview = async (reviewData) => {
  const { data } = await api.post('/reviews/', reviewData);
  return data;
};

export const fetchAdBySlot = async (slotName) => {
  const { data } = await api.get(`/ads/slot/${slotName}`);
  return data;
};

export const fetchSponsorshipPlans = async () => {
  const { data } = await api.get('/sponsorship/plans');
  return data;
};

export const subscribeSponsorship = async (subscribeData) => {
  const { data } = await api.post('/sponsorship/subscribe', subscribeData);
  return data;
};

export default api;
