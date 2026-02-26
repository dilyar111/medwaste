import React from 'react';

const AlertBanner = ({ message, type }) => {
  const bannerStyle = {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    color: 'white',
    backgroundColor: type === 'error' ? '#f44336' : '#2196f3', // Red for error, blue for info
  };

  return (
    <div style={bannerStyle}>
      {message}
    </div>
  );
};

export default AlertBanner;