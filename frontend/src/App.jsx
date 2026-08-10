import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { FilterProvider } from './context/FilterContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import MisalAIChatbot from './components/ai/MisalAIChatbot';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import ShopDetailPage from './pages/ShopDetailPage';
import PassportPage from './pages/PassportPage';
import SubmitShopPage from './pages/SubmitShopPage';
import PricingPage from './pages/PricingPage';
import MerchantDashboardPage from './pages/MerchantDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <FilterProvider>
              <Router>
                <div className="min-h-screen flex flex-col justify-between bg-amber-50/40 selection:bg-brand-500 selection:text-white relative">
                  <div>
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/directory" element={<DirectoryPage />} />
                      <Route path="/misal/:slug" element={<ShopDetailPage />} />
                      <Route path="/passport" element={<PassportPage />} />
                      <Route path="/submit-shop" element={<SubmitShopPage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/merchant/dashboard" element={<MerchantDashboardPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </div>
                  <Footer />

                  {/* Floating AI Misal Combo Assistant Widget */}
                  <MisalAIChatbot />
                </div>
              </Router>
            </FilterProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
