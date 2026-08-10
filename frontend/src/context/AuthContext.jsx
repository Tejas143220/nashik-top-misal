import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    const saved = localStorage.getItem('nashik_misal_user_id');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPassport = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/v1/passport/${userId}`);
      setPassport(data);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      throw err;
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
      setPassport(data);
      return data;
    } catch (err) {
      console.error(err);
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
