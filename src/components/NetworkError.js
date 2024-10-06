import React, { useState, useEffect } from 'react';
import './NetworkError.css';

const NetworkError = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  return !isOnline ? <div>You are offline</div> : null;
};

export default NetworkError;