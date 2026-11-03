import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import type { StatCardProps } from './schema';
import './stat-card.css';

/* Inline SVGs for trend indicators to keep the component dependency-free */
const TREND_ICONS = {
  up: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  ),
  down: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
    </svg>
  ),
  neutral: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  ),
};

/* 🪄 Magic Component: Rising Numbers with Scale Effect */
const AnimatedNumber = ({ value }: { value: string | number }) => {
  const stringValue = String(value);
  
  // Extract the number from the string (e.g., "$45,231.89" -> "45,231.89")
  const match = stringValue.match(/([0-9.,]+)/);

  // If there are no numbers (e.g., "N/A"), just return the text with a scale effect
  if (!match) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.5, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {stringValue}
      </motion.span>
    );
  }

  const numberString = match[0];
  const numericValue = parseFloat(numberString.replace(/,/g, ''));
  
  if (isNaN(numericValue)) return <span>{stringValue}</span>;

  // Keep the prefix ($) and suffix (%, k)
  const prefix = stringValue.slice(0, match.index);
  const suffix = stringValue.slice(match.index! + numberString.length);
  
  // Detect formatting (decimals and commas)
  const decimals = numberString.includes('.') ? numberString.split('.')[1].length : 0;
  const hasCommas = numberString.includes(',');

  const count = useMotionValue(0);
  
  // Format the counting number back into the styled string
  const rounded = useTransform(count, (latest) => {
    let formatted = latest.toFixed(decimals);
    if (hasCommas) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      formatted = parts.join('.');
    }
    return `${prefix}${formatted}${suffix}`;
  });

  // Trigger the counter animation on mount
  useEffect(() => {
    const controls = animate(count, numericValue, {
      type: "spring",
      stiffness: 50,  
      damping: 20,    
      mass: 1,
    });
    return controls.stop;
  }, [numericValue, count]);

  return (
    <motion.span
      /* ✨ The Scaling Effect for the numbers */
      initial={{ opacity: 0, scale: 0.5, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.1 // Slight delay so the card pops in first, then the numbers
      }}
      style={{ display: "inline-block", transformOrigin: "left center" }}
    >
      {rounded}
    </motion.span>
  );
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  delta,
  trend = 'neutral',
  size = 'md',
  theme = 'dark',
  icon,
  className = '',
}) => {
  const classes = ['stat-card', className].filter(Boolean).join(' ');

  return (
    <motion.div
      className={classes}
      data-trend={trend}
      data-size={size}
      data-theme={theme}
      
      /* 1. Entry Spring */
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }} 

      /* 2. Hover & Tap Springs */
      whileHover={{ 
        scale: 1.03, 
        y: -4, // Lifts up slightly
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        } 
      }}
      whileTap={{ 
        scale: 0.98, // Squishes down when clicked
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        } 
      }}
    >
      <div className="stat-card__header">
        <span className="stat-card__title">{title}</span>
        {icon && <div className="stat-card__icon">{icon}</div>}
      </div>

      <div className="stat-card__value">
        {/* 🪄 Replaced static value with the scaling counting logic */}
        <AnimatedNumber value={value} />
      </div>

      {delta !== undefined && delta !== null && (
        <div className="stat-card__footer">
          <span className="stat-card__delta">
            {TREND_ICONS[trend]}
            {delta}
          </span>
          <span className="stat-card__caption">vs last period</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;