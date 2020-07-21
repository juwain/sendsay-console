import React from 'react';
import './Alert.css';

const Alert = ({ className, title, text }) => {
  return (
    <div className={`${className} alert`}>
      <h2 className="alert__title">{title}</h2>
      <p className="alert__text">{text}</p>
    </div>
  );
}

export { Alert };
