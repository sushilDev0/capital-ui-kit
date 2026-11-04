import React from "react";

interface DemoBlockProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const DemoBlock = ({ title, description, children }: DemoBlockProps) => {
  return (
    <div className="app-blocks">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
};