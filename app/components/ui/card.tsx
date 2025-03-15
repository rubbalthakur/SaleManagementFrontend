// components/Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => (
  <div className="bg-white shadow-lg rounded-lg p-6">{children}</div>
);

export const CardContent: React.FC<CardProps> = ({ children }) => (
  <div className="p-4">{children}</div>
);
