import React, { useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SendsayContext } from '../../context/SendsayContext';
import { Button } from '../Button/Button';
import { Alert } from '../Alert/Alert';
import { formatJSON, validate } from '../../utils';
import { actionTypes } from '../../redux/actions';
import './LoginForm.css';

const LoginForm = ({ className }) => {
  const sendsay = useContext(SendsayContext);
  const dispatch = useDispatch();

  const [isActiveValidation, setIsActiveValidation] = useState(false);
  const [isLoginValid, setIsLoginValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorHappened, setIsErrorHappened] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [inputs, setInputs] = useState({
    login: '',
    sublogin: '',
    password: ''
  });

  const { login, sublogin, password } = inputs;

  const validateFields = () => {
    // логином может быть как email, так и строка
    // из латинских букв, цифр и подчеркиваний
    const loginValidity =
      validate(login, 'trimmedEmptiness') && (
        validate(login, 'email') ||
        validate(login, 'username')
      );

    // в пароле пробелы могут встречаться, а кириллица — нет
    const passwordValidity = validate(password, 'password');

    // сайд эффектом проверки валидности инпута
    // задаётся состояние isLoginValid и isPasswordValid
    setIsLoginValid(loginValidity);
    setIsPasswordValid(passwordValidity);

    return loginValidity && passwordValidity;
  }

  const performLogin = () => {
    setIsLoading(true);

    sendsay.login({
      login,
      sublogin,
      password
    }).then(() =>
      dispatch({
        type: actionTypes.LOGIN,
        session: sendsay.session
      })
    ).catch(error => {
      setIsErrorHappened(true);
      setErrorMessage(formatJSON(error, ' '));
      setIsLoading(false);
    })
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setInputs(inputs => ({ ...inputs, [name]: value }));

    if (isActiveValidation) {
      setIsActiveValidation(false);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateFields()) {
      setIsActiveValidation(true);
    } else {
      performLogin();
    }
  }

  useEffect(() => {
    setIsDisabled(!login || !password)
  }, [login, password])

  return (
    <form className={`${className} login-form`} onSubmit={handleSubmit}>
      <h1 className="login-form__heading">API‑консолька</h1>

      {isErrorHappened &&
        <Alert className="login-form__alert alert--warn" title="Вход не вышел" text={errorMessage} />
      }

      <p className={`
        login-form__item
        ${isActiveValidation && !isLoginValid ? 'login-form__item--invalid' : ''}
      `}>
        <label className="login-form__label" htmlFor="login">Логин</label>
        <input className="login-form__input" type="text" name="login" id="login" value={login} onChange={handleChange} />
      </p>

      <p className="login-form__item">
        <label className="login-form__label" htmlFor="sublogin">Сублогин</label>
        <span className="login-form__annotation">Опционально</span>
        <input type="text" name="sublogin" id="sublogin" value={sublogin} onChange={handleChange} className="login-form__input" />
      </p>

      <p className={`
        login-form__item
        ${isActiveValidation && !isPasswordValid ? 'login-form__item--invalid' : ''}
      `}>
        <label className="login-form__label" htmlFor="password">Пароль</label>
        <input className="login-form__input" type="password" name="password" id="password" value={password} onChange={handleChange} />
      </p>

      <Button
        className="login-form__button button--primary button--blue button--rounded button--padded"
        type="submit"
        disabled={isDisabled}
        loading={isLoading}
      >
        Войти
      </Button>
    </form>
  );
}

export { LoginForm };
