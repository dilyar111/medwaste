import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#4CAF50'; // Green
      case 'inactive':
        return '#f44336'; // Red
      case 'pending':
        return '#FFEB3B'; // Yellow
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const badgeStyle = {
    display: 'inline-block',
    padding: '5px 10px',
    borderRadius: '12px',
    color: 'white',
    backgroundColor: getStatusColor(status),
    fontSize: '0.8em',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  };

  return (
    <span style={badgeStyle}>
      {status}
    </span>
  );
};

export default StatusBadge;