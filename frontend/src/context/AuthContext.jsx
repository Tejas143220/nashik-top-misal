import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const DEFAULT_PASSPORT = {
  user_id: 1,
  user_name: 'Tejas Thakare',
  email: 'tejas@nashikmisal.in',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  total_stamps: 3,
  stamps: [
    { id: 1, shop_id: 1, shop_name: 'Sadhana Chulhivarchi Misal', shop_area: 'Gangapur Road', stamped_at: '2026-08-01' },
    { id: 2, shop_id: 2, shop_name: 'Shamsundar Misal', shop_area: 'Panchavati', stamped_at: '2026-08-05' },
    { id: 3, shop_id: 3, shop_name: 'Perachi Wadi Misal', shop_area: 'Gangapur Road', stamped_at: '2026-08-08' },
  ],
  badges: [
    { id: 1, badge_name: 'Zanzanit Warrior 🌶️', description: 'Sampled Level 5 Spicy Misal', badge_icon: '🔥' }
  ]
};

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    const saved = localStorage.getItem('nashik_misal_user_id');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [passport, setPassport] = useState(DEFAULT_PASSPORT);
  const [loading, setLoading] = useState(false);

  const fetchPassport = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/v1/passport/${userId}`);
      if (data && data.user_name) {
        setPassport(data);
      } else {
        setPassport(DEFAULT_PASSPORT);
      }
    } catch (_err) {
      setPassport(DEFAULT_PASSPORT);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createOrLoginProfile = async (fullName, email, avatarUrl) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/v1/passport/profile', {
        full_name: fullName,
        email: email,
        avatar_url: avatarUrl
      });
      setUserId(data.user_id);
      localStorage.setItem('nashik_misal_user_id', data.user_id.toString());
      setPassport(data);
      return data;
    } catch (_err) {
      const mockUser = {
        ...DEFAULT_PASSPORT,
        user_id: Date.now(),
        user_name: fullName || 'Nashik Foodie',
        email: email || 'foodie@nashikmisal.in',
        avatar_url: avatarUrl || DEFAULT_PASSPORT.avatar_url
      };
      setPassport(mockUser);
      return mockUser;
    } finally {
      setLoading(false);
    }
  };

  const switchProfile = (newUserId) => {
    setUserId(newUserId);
    localStorage.setItem('nashik_misal_user_id', newUserId.toString());
  };

  const stampPassport = async (shopId) => {
    try {
      const { data } = await axios.post(`/api/v1/passport/${userId}/stamp/${shopId}`);
      if (data && data.stamps) setPassport(data);
      return data;
    } catch (_err) {
      return passport;
    }
  };

  useEffect(() => {
    fetchPassport();
  }, [fetchPassport]);

  return (
    <AuthContext.Provider
      value={{
        userId,
        passport,
        loading,
        fetchPassport,
        stampPassport,
        createOrLoginProfile,
        switchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
