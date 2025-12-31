import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
  variant?: 'default' | 'compact' | 'card';
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  action,
  variant = 'default',
  className = ''
}) => {
  return (
    <div className={`empty-state empty-state-${variant} ${className}`}>
      <div className="empty-state-icon">
        <span className="material-icons">{icon}</span>
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {action && (
        <button className="btn btn-primary empty-state-action" onClick={action.onClick}>
          {action.icon && <span className="material-icons">{action.icon}</span>}
          {action.label}
        </button>
      )}
    </div>
  );
};

// Pre-defined empty states for common scenarios
export const EmptyEmployees: React.FC<{ onAdd?: () => void }> = ({ onAdd }) => (
  <EmptyState
    icon="group_off"
    title="No Employees Yet"
    description="Get started by adding your first employee to manage payroll and payments."
    action={onAdd ? {
      label: "Add Employee",
      onClick: onAdd,
      icon: "person_add"
    } : undefined}
  />
);

export const EmptyTransactions: React.FC = () => (
  <EmptyState
    icon="receipt_long"
    title="No Transactions"
    description="Your transaction history will appear here once you process payments."
  />
);

export const EmptyPayments: React.FC = () => (
  <EmptyState
    icon="payment"
    title="No Payments Received"
    description="Payments from your employer will appear here. All transactions are protected with confidential transfers."
  />
);

export const EmptySearch: React.FC<{ query?: string; onClear?: () => void }> = ({ query, onClear }) => (
  <EmptyState
    icon="search_off"
    title="No Results Found"
    description={query ? `No items match "${query}". Try adjusting your search or filters.` : "Try adjusting your search or filters."}
    action={onClear ? {
      label: "Clear Search",
      onClick: onClear,
      icon: "clear"
    } : undefined}
  />
);

export const WalletNotConnected: React.FC<{ onConnect?: () => void }> = ({ onConnect }) => (
  <EmptyState
    icon="account_balance_wallet"
    title="Wallet Not Connected"
    description="Connect your Solana wallet to access all features and manage your payments."
    action={onConnect ? {
      label: "Connect Wallet",
      onClick: onConnect,
      icon: "link"
    } : undefined}
  />
);

export const NetworkError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <EmptyState
    icon="wifi_off"
    title="Connection Error"
    description="Unable to connect to the server. Please check your connection and try again."
    action={onRetry ? {
      label: "Retry",
      onClick: onRetry,
      icon: "refresh"
    } : undefined}
  />
);

export default EmptyState;
