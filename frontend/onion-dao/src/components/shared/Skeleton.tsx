import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'wave'
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <div
      className={`skeleton skeleton-${variant} skeleton-${animation} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

// Skeleton Card - Reusable card skeleton
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton-card ${className}`}>
    <div className="skeleton-card-header">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="skeleton-card-title-group">
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
    </div>
    <div className="skeleton-card-body">
      <Skeleton variant="text" width="100%" height={16} />
      <Skeleton variant="text" width="80%" height={16} />
      <Skeleton variant="text" width="90%" height={16} />
    </div>
  </div>
);

// Skeleton Table Row
export const SkeletonTableRow: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <div className="skeleton-table-row">
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton key={i} variant="text" width={`${100 / columns - 5}%`} height={20} />
    ))}
  </div>
);

// Skeleton Table
export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4
}) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" width={`${100 / columns - 5}%`} height={16} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonTableRow key={i} columns={columns} />
    ))}
  </div>
);

// Skeleton Employee Card
export const SkeletonEmployeeCard: React.FC = () => (
  <div className="skeleton-employee-card">
    <div className="skeleton-employee-header">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="skeleton-employee-info">
        <Skeleton variant="text" width={150} height={18} />
        <Skeleton variant="text" width={100} height={14} />
      </div>
      <Skeleton variant="rectangular" width={80} height={28} />
    </div>
    <div className="skeleton-employee-details">
      <Skeleton variant="text" width="100%" height={16} />
      <Skeleton variant="text" width="70%" height={16} />
    </div>
  </div>
);

// Skeleton Transaction Card
export const SkeletonTransactionCard: React.FC = () => (
  <div className="skeleton-transaction-card">
    <div className="skeleton-transaction-header">
      <Skeleton variant="text" width={120} height={18} />
      <Skeleton variant="rectangular" width={80} height={24} />
    </div>
    <div className="skeleton-transaction-details">
      <div className="skeleton-transaction-row">
        <Skeleton variant="text" width={60} height={14} />
        <Skeleton variant="text" width={100} height={14} />
      </div>
      <div className="skeleton-transaction-row">
        <Skeleton variant="text" width={80} height={14} />
        <Skeleton variant="text" width={120} height={14} />
      </div>
      <div className="skeleton-transaction-row">
        <Skeleton variant="text" width={70} height={14} />
        <Skeleton variant="text" width={80} height={14} />
      </div>
    </div>
  </div>
);

// Skeleton Dashboard Stats
export const SkeletonDashboardStats: React.FC = () => (
  <div className="skeleton-dashboard-stats">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="skeleton-stat-card">
        <Skeleton variant="text" width={80} height={14} />
        <Skeleton variant="text" width={100} height={32} />
        <Skeleton variant="text" width={60} height={12} />
      </div>
    ))}
  </div>
);

// Skeleton Balance Card
export const SkeletonBalanceCard: React.FC = () => (
  <div className="skeleton-balance-card">
    <div className="skeleton-balance-header">
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="text" width={150} height={20} />
    </div>
    <Skeleton variant="text" width={200} height={36} className="skeleton-balance-amount" />
    <div className="skeleton-balance-actions">
      <Skeleton variant="rectangular" width={100} height={36} />
      <Skeleton variant="rectangular" width={100} height={36} />
    </div>
  </div>
);

export default Skeleton;
