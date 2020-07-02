import React from 'react';
import { Button } from '../Button/Button';
import { UserLink } from '../UserLink/UserLink';
import { ReactComponent as IconFormat } from './icon-format.svg';
import './Actions.css';

const Actions = ({ className, performRequest, formatRequest, isDisabled }) => {
  return (
    <footer className={`${className} actions`}>
      <Button className="button--primary button--blue button--rounded button--padded" onClick={performRequest} disabled={isDisabled}>
        Отправить
      </Button>

      <UserLink />

      <Button className="actions__button button--transparent button--text-right button--rounded button--padded" onClick={formatRequest}>
        <IconFormat />
        <span className="button__text">Форматировать</span>
      </Button>
    </footer>
  );
}

export { Actions };
