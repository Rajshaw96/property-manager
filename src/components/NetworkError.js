import React from 'react';
import './NetworkError.css';

const NetworkError = () => {
  return (
    <div className="network-error-container">
      <h1>Network Error</h1>
      <p>There was a problem connecting to the server. Please check your internet connection or try again later.</p>
    </div>
  );
};

export default NetworkError;
