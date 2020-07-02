import React, { useState, useRef, useEffect } from 'react';
import { setPropertyValue } from '../../utils';
import './Scrollable.css';

const Scrollable = ({ className, childClassName, children }) => {
  const DELTA_MULTIPLICATOR = 3;
  const [scrollDelta, setScrollDelta] = useState(0);
  const scrollableContainerRef = useRef();
  const scrollableContentRef = useRef();

  /* TODO:
  - оптимизировать,
  - добавить тротлинг,
  - нормализовать колесо
  */
  const onWheel = (event) => {
    event.preventDefault();

    const scrollContainerWidth = scrollableContainerRef.current.offsetWidth;
    const scrollContentWidth = scrollableContentRef.current.offsetWidth;

    if (scrollContentWidth > scrollContainerWidth) {
      const scrollPeriod = scrollContainerWidth - scrollContentWidth;
      let transformValue;

      if (scrollDelta > 0) {
        transformValue = 0;
      } else if (scrollDelta < scrollPeriod) {
        transformValue = scrollPeriod;
      } else {
        transformValue = scrollDelta - event.deltaY * DELTA_MULTIPLICATOR;
      }

      setScrollDelta(transformValue);
    }
  }

  useEffect(() => {
    setPropertyValue(
      scrollableContentRef.current,
      '--scroll-delta',
      scrollDelta + 'px'
    );
  }, [scrollDelta])

  return (
    <div className={`${className} scrollable`} ref={scrollableContainerRef} onWheel={onWheel}>
      <div className={`${childClassName} scrollable__content`} ref={scrollableContentRef}>
        {children}
      </div>
    </div>
  );
};

export { Scrollable };
