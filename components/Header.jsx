import React from 'react';

export const H1Header = ({ children }) => {
  return (
    <h1
      className="max-md:text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {children}
    </h1>
  )
};

export const H2Header = ({ children }) => {
  return (
    <h1
      className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {children}
    </h1>
  )
};

export const H3Header = ({ children }) => {
  return (
    <h1
      className="text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {children}
    </h1>
  )
};
