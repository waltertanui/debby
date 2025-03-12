import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Reports from './pages/Reports';
import { isSupabaseConfigured } from './lib/supabase';

function App() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Box className="h-12 w-12 text-[#00A4E4]" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Configuration Required
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Please connect your Supabase project to continue. Click the "Connect to Supabase" button in the top right corner.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <Hero />
            <Features />
            <Stats />
            <CTA />
            <Footer />
          </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;