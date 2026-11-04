import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import type { FinancialCalculatorProps } from './schema';
import './FinancialCalculator.css';

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({
  title, // 👈 Now we use this in the JSX below
  inputs,
  locale,
  theme = "dark",
  className = "",
  calculate,
}) => {
  // 1. Initialize state dynamically from the inputs array
  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    inputs.forEach(input => { initial[input.id] = input.defaultValue; });
    return initial;
  });

  // 2. Run the custom math function whenever values change
  const { result, table } = useMemo(() => {
    return calculate(values);
  }, [values, calculate]);

  return (
    <div className={`calc-engine ${className}`} data-theme={theme}>
      
      {/* 👈 Render the Title */}
      <h2 className="calc-engine__title">{title}</h2>

      <div className="calc-engine__layout">
        {/* LEFT: Dynamic Sliders */}
        <div className="calc-engine__controls">
          {inputs.map((input) => (
            <div key={input.id} className="calc-engine__control-group">
              <div className="calc-engine__label-row">
                <label>{input.label}</label>
                <span className="calc-engine__value-badge">
                  {input.prefix || ""} 
                  {values[input.id].toLocaleString(locale)} 
                  {input.suffix || ""}
                </span>
              </div>
              <input 
                type="range" 
                min={input.min} 
                max={input.max} 
                step={input.step}
                value={values[input.id]} 
                onChange={(e) => setValues({ ...values, [input.id]: Number(e.target.value) })}
              />
            </div>
          ))}
        </div>

        {/* RIGHT: Dynamic Results */}
        <div className="calc-engine__results">
          <motion.div 
            key={result.highlightValue} // Animates when value changes
            initial={{ opacity: 0.5, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="calc-engine__stat"
          >
            <span className="calc-engine__stat-label">{result.highlightLabel}</span>
            <span className="calc-engine__stat-value highlight">
              {result.highlightValue}
            </span>
          </motion.div>

          <div className="calc-engine__breakdown">
            {result.breakdown.map((item, idx) => (
              <div key={idx} className="calc-engine__breakdown-item">
                <span>{item.label}</span>
                <span className={item.isWarning ? "text-warning" : ""}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM: Dynamic Table */}
      {table && table.rows.length > 0 && (
        <div className="calc-engine__table-container">
          <div className="calc-engine__table-scroll">
            <table className="calc-engine__table">
              <thead>
                <tr>
                  {table.columns.map((col, i) => <th key={i}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};