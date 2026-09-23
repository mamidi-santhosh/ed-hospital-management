import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeClass = (s) => {
    switch (s?.toUpperCase()) {
      case 'CONFIRMED':
        return 'badge-confirmed';
      case 'PENDING':
        return 'badge-pending';
      case 'CANCELLED':
        return 'badge-cancelled';
      case 'COMPLETED':
        return 'badge-completed';
      default:
        return 'badge-pending';
    }
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {status}
    </span>
  );
};
