import React from 'react';

const AlertBanner = ({ message, type }) => {
  const bannerClass = `alert-banner ${type === 'error' ? 'error' : 'info'}`;

  return (
    <div className={bannerClass}>
      {message}
    </div>
  );
};

export default AlertBanner;