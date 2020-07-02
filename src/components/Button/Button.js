import React from 'react';
import './Button.css';

import { ReactComponent as Spinner } from './icon-loading.svg';

const Button = ({ className, children, loading, type='button', ...restParams }) => {
  return (
    <button className={`${className} button`} {...restParams} type={type}>
      {loading ?
        <Spinner />
      :
        children
      }
    </button>
  );
}

export { Button };
