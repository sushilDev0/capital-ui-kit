import React from 'react';
import type { StatusBadgeProps } from "./schema";
import "./status-badge.css";


const ICONS = {
  paid: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  pending: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  failed: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  refunded: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
  ),
  disputed: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.003A9.004 9.004 0 003 12c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-3.77-2.316-7.003-9-10.003z" />
    </svg>
  ),
  authorized: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  payout_sent: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  ),

  requested: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  ),
  accepted: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
    </svg>
  ),
  arrived: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  in_transit: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.75 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5l1.5 6v4.5h-2.25m-15 0H3V12l1.5-6z" />
    </svg>
  ),
  completed: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  cancelled_by_driver: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),

  shipped: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.75 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h12v13.5H3zM15 9h4.5l3 4.5V16.5H15z" />
    </svg>
  ),
  delivered: (
    <svg className="sb-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  ),
};

/* Labels only — colors/sizes now live in CSS. */
const STATUS_LABELS: Record<string, string> = {
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
  refunded: 'Refunded',
  disputed: 'Disputed',
  authorized: 'Authorized',
  payout_sent: 'Payout Sent',
  requested: 'Requested',
  accepted: 'Driver Assigned',
  arrived: 'At Pickup',
  in_transit: 'In Transit',
  completed: 'Completed',
  cancelled_by_driver: 'Driver Cancelled',
  shipped: 'Out for Delivery',
  delivered: 'Delivered',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'pending',
  size = 'md',
  showIcon = true,
  label,
  theme = 'dark',
  color = 'auto',
  className = '',
}) => {
  const key = String(status).toLowerCase();
  const displayLabel = label ?? STATUS_LABELS[key] ?? STATUS_LABELS.pending;
  const icon = ICONS[key as keyof typeof ICONS] ?? ICONS.pending;
  const classes = ['sb-badge', className].filter(Boolean).join(' ');

  return (
    <span
      className={classes}
      data-status={key}
      data-size={size}
      data-theme={theme}
      data-color={color === 'auto' ? undefined : color}
    >
      {showIcon && icon}
      <span className="sb-badge__label">{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;