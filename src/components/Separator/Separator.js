import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../Button/Button';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import { ReactComponent as IconDots } from '../../assets/img/icon-dots.svg';
import './Separator.css';

const Separator = ({
    className,
    handleDrag
  }) => {

  const [isDragging, setIsDragging] = useState(false);
  const separatorRef = useRef();

  useEffect(() => {
    const removeDrag = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', removeDrag);

      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', removeDrag);
      }
    }
  }, [isDragging, handleDrag]);

  return (
    <div className={`${className} separator`} ref={separatorRef}>
      <Button className="separator__drag-button button button--transparent" onMouseDown={() => setIsDragging(true)}>
        <VisuallyHidden>Перетащить для изменения размера панелей</VisuallyHidden>
        <IconDots />
      </Button>
    </div>
  );
}

export { Separator };
