import React from 'react';
import './VisuallyHidden.css';

const VisuallyHidden = ({ children }) => {
  return (
    <span className="visually-hidden">{children}</span>
  );
}

export { VisuallyHidden };
