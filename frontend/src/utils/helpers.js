import { SPICY_LEVELS } from './constants';

export const getSpicyInfo = (level) => {
  return SPICY_LEVELS.find((s) => s.level === level) || SPICY_LEVELS[2];
};

export const formatPrice = (price) => {
  if (!price) return '₹100 - ₹150';
  return `₹${price}`;
};
