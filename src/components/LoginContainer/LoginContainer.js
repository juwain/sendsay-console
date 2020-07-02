import React from 'react';
import { UserLink } from '../UserLink/UserLink';
import { LoginForm } from '../LoginForm/LoginForm';
import logo from '../../assets/img/logo.svg';
import './LoginContainer.css';

const LoginContainer = () => {
  return (
    <section className="login-container">
      <header className="login-container__header">
        <img src={logo} alt="Sendsay logo" />
      </header>

      <LoginForm className="login-container__form" />

      <footer className="login-container__footer">
        <UserLink />
      </footer>
    </section>
  );
}

export { LoginContainer };
