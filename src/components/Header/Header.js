import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SendsayContext } from '../../context/SendsayContext';
import { Button } from '../Button/Button';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import { ReactComponent as IconLogout } from './icon-logout.svg';
import { ReactComponent as IconFullScreen } from './icon-fullscreen.svg';
import { ReactComponent as IconPartScreen } from './icon-partscreen.svg';
import logo from '../../assets/img/logo.svg';
import './Header.css';

const Header = ({ className, mainRef }) => {
  const sendsay = useContext(SendsayContext);
  const dispatch = useDispatch();
  const account = useSelector(state => state.account);
  const sublogin = useSelector(state => state.sublogin);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    let fullScreenPromise = isFullScreen ?
      document.exitFullscreen()
    :
      mainRef.current.requestFullscreen();

    fullScreenPromise.catch(() => {
      console.log('error');
    });
  }

  const handleFullScreen = () => setIsFullScreen(!isFullScreen);

  const performLogout = () => {
    sendsay.request({
      action: 'logout'
    }).catch(error =>
      console.log(error)
    ).finally(() => {
      dispatch({
        type: 'logout'
      })
    })
  }

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreen);

    return () => document.removeEventListener('fullscreenchange', handleFullScreen);
  });

  return (
    <header className={`${className} header`}>
      <img className="header__logo" src={logo} alt="Sendsay logo" />
      <h1 className="header__heading">API‑консолька</h1>
      <p className="header__user-info">
        <span>{account}</span>
        {account !== sublogin && <span>{sublogin}</span>}
      </p>
      <Button className="header__button button--transparent button--text-left button--rounded button--padded" onClick={performLogout}>
        <span className="button__text">Выйти</span>
        <IconLogout />
      </Button>
      <Button className="header__button button--transparent button--rounded button--padded" onClick={toggleFullScreen}>
        <VisuallyHidden>Развернуть на полный экран</VisuallyHidden>
        {isFullScreen ?
          <IconFullScreen />
        :
          <IconPartScreen />
        }
      </Button>
    </header>
  );
};

export { Header };
