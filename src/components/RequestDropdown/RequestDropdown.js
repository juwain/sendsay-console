import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../Button/Button';
import { setPropertyValue } from '../../utils';
import { ReactComponent as IconDots } from '../../assets/img/icon-dots.svg';
import './RequestDropdown.css';

let RequestDropdown = ({
    className,
    dropdownDataSource,
    onClick,
    historyItem
  }) => {
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const [isMenuPositioned, setMenuPositioned] = useState(false);
  const [isNotificationVisible, setNotificationVisibility] = useState(false);

  const requestDropdownRef = useRef();
  const requestDropdownMenuRef = useRef();

  const NOTIFICATION_TIMEOUT = 2000;

  const positionMenu = () => {
    /* TODO:
    - разобраться с кейсом, когда видны скроллы,
    - учесть скролл страницы в вычислениях
    - учесть скролл истории запросов в вычислениях
    */
    const dropdownBounds = requestDropdownRef.current.getBoundingClientRect();
    const menu = requestDropdownMenuRef.current;
    const menuBounds = menu.getBoundingClientRect();

    // флаг, что показанный попап ушёл за левую гланицу экрана
    const isLeftBoundPassed = dropdownBounds.right - menuBounds.width < 0;

    // флаг, что показанный попап ушёл за нижнюю гланицу экрана
    const isBottomBoundPassed = dropdownBounds.bottom + menuBounds.height > window.innerHeight;

    const leftMenuCoord = (isLeftBoundPassed) ?
      // меню выравнивается по левой части дропдауна
      dropdownBounds.left
      :
      // меню выравнивается по правой части дропдауна
      dropdownBounds.right - menuBounds.width;

    const topMenuCoord = (isBottomBoundPassed) ?
      // меню позиционируется сверху дропдауна
      dropdownBounds.top - menuBounds.height
      :
      // меню позиционируется снизу дропдауна
      dropdownBounds.top + dropdownBounds.height;

    // по дефолту меню показывается снизу дропдауна
    // и выравнивается по его правой части
    setPropertyValue(menu, 'left', leftMenuCoord + 'px');
    setPropertyValue(menu, 'top', topMenuCoord + 'px');
  }

  const toggleMenu = () => setMenuVisibility(!isMenuVisible);

  const onMenuItemClick = (callback, withNotificationCallback) => {
    toggleMenu();

    callback(historyItem, withNotificationCallback ?
      () => {
        setNotificationVisibility(true);
        setTimeout(() => setNotificationVisibility(false), NOTIFICATION_TIMEOUT);
      } : null
    );
  }

  useEffect(() => {
    // если меню видимо, оно позиционируется
    if (isMenuVisible) {
      positionMenu();
      setMenuPositioned(true);
    }

    return () => setMenuPositioned(false);
  }, [isMenuVisible])

  useEffect(() => {
    // если меню видимо, то включается обработчик,
    // отслеживающий клики по всему документу,
    // чтобы закрывать меню по клику вне выпадающего меню
    if (isMenuVisible) {
      const handleDocumentClick = (event) => {
        if (!requestDropdownRef.current.contains(event.target)) {
          setMenuVisibility(false);
        };
      }

      // а также обработчик, отслеживающий нажатие с клавиатуры
      // по всему документу, чтобы закрывать меню по нажатию клавиши ESC
      const handleDocumentKeyPress = ({ key }) => {
        if (key === 'Escape') {
          setMenuVisibility(false);
        }
      };

      document.addEventListener('click', handleDocumentClick);
      document.addEventListener('keydown', handleDocumentKeyPress);

      return () => {
        document.removeEventListener('click', handleDocumentClick);
        document.removeEventListener('keydown', handleDocumentKeyPress);
      }
    }
  }, [isMenuVisible]);

  return (
    <div className={`${className} request-dropdown request-dropdown--${historyItem.status ? 'success' : 'fail'}`} ref={requestDropdownRef}>
      <div className={`request-dropdown__wrap ${isNotificationVisible ? 'request-dropdown__wrap--overflow' : ''}`}>
        <Button className="request-dropdown__data-button button--transparent button--rounded" onClick={() => onClick(historyItem)}>
          <span className="request-dropdown__action-name">
            {historyItem.request.action || '-'}
          </span>
        </Button>
        <Button className="request-dropdown__menu-button button--transparent button--rounded" onClick={toggleMenu}>
          <IconDots />
        </Button>
        {isNotificationVisible && <span className="request-dropdown__notification">
          Скопировано
        </span>}
      </div>
      <div className={`
          request-dropdown__menu
          ${isMenuVisible ? 'request-dropdown__menu--visible' : ''}
          ${isMenuPositioned ? 'request-dropdown__menu--positioned' : ''}
        `}
        ref={requestDropdownMenuRef}
      >
        {dropdownDataSource.map((set, index) =>
          <p className="request-dropdown__menu-items-set" key={index}>
            {set.map(item =>
              <Button key={item.text}
                className={`
                  request-dropdown__menu-item
                  button--transparent
                  ${item.isDestructive ? 'request-dropdown__menu-item--destructive' : ''}
                `}
                onClick={() => onMenuItemClick(item.onClick, item.withNotificationCallback)}
              >
                {item.text}
              </Button>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export { RequestDropdown };
