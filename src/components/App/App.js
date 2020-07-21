import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginContainer } from '../LoginContainer/LoginContainer';
import { Console } from '../Console/Console';
import { SendsayContext } from '../../context/SendsayContext';
import { actionTypes } from '../../redux/actions';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const session = useSelector(state => state.session);
  const sendsay = useContext(SendsayContext);

  useEffect(() => {
    sendsay.request({
      session,
      action: 'pong'
    }).then(({ account, sublogin }) =>
      dispatch({
        type: actionTypes.SET_USER_DATA,
        userData: {
          account,
          sublogin
        }
      })
    ).catch(error => {
      if (error.id === 'error/auth/failed') {
        dispatch({
          type: actionTypes.LOGOUT
        });
      }
    })
  }, [session, sendsay, dispatch])

  return (
    <SendsayContext.Provider value={sendsay}>
      {session ?
        <Console />
      :
        <LoginContainer />
      }
    </SendsayContext.Provider>
  );
}

export { App };
