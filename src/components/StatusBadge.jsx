import React from 'react';

const StatusBadge = ({ status }) => {
  const badgeClass = `status-badge ${status.toLowerCase()}`;

  return (
    <span className={badgeClass}>
      {status}
    </span>
  );
};

export default StatusBadge;