// src/components/common/LoadingOverlay.js
import React from 'react';

const LoadingOverlay = ({ message = 'جاري التحميل...' }) => {
  const overlayStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
  };
  
  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  };
  
  const spinnerStyle = {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(225, 29, 72, 0.2)',
    borderRadius: '50%',
    borderTopColor: 'rgba(225, 29, 72, 1)',
    animation: 'spin 1s ease-in-out infinite',
  };
  
  const messageStyle = {
    color: '#666',
    fontSize: '16px',
    margin: 0,
  };
  
  return (
    <div style={overlayStyle}>
      <div style={contentStyle}>
        <div style={spinnerStyle} className="spinner"></div>
        <p style={messageStyle}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
