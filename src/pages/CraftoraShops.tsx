// pages/CraftoraShops.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../app/Header';
import Hero from '../app/Hero';
import Featured from '../app/Featured'

// Components


const CraftoraShops: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

   const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };


 const colors = isDarkMode ? {
    // dark mode renkleri
    bg: '#121212',
    surface: '#1e1e1e',
    surface2: '#2a2a2a',
    text: '#eeeeee',
    textSecondary: '#a0a0a0',
    border: '#2a2a2a',
    primary: '#e07c5c',
    primaryDark: '#c96b4d',
    primaryLight: '#f5a07c',
} : {
    // light mode renkleri
    bg: '#ffffff',
    surface: '#f5f5f5',
    surface2: '#e8e8e8',
    text: '#1a1a1a',
    textSecondary: '#666666',
    border: '#dddddd',
    primary: '#e07c5c',
    primaryDark: '#c96b4d',
    primaryLight: '#f5a07c',
};


  return (
    <div style={{
      backgroundColor: colors.bg,
      color: colors.text,
      fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      <Header colors={colors} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      <Hero colors={colors} isDarkMode={isDarkMode} />
      <Featured colors={colors} isDarkMode={isDarkMode} />
    </div>
  );
};

export default CraftoraShops;