import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../Header/Header';
import { History } from '../History/History';
import { EditorsSet } from '../EditorsSet/EditorsSet';
import { Actions } from '../Actions/Actions';
import { SendsayContext } from '../../context/SendsayContext';
import { formatJSON } from '../../utils';
import { isEqual } from '../../utils';
import './Console.css';

const Console = () => {
  const sendsay = useContext(SendsayContext);

  const [requestJSON, setRequestJSON] = useState('');
  const [responseJSON, setResponseJSON] = useState('');
  const [isRequestValid, setRequestValidity] = useState(true);
  const [isResponseValid, setResponseValidity] = useState(true);
  const [isRequestEmpty, setRequestEmptiness] = useState(true);
  const [needToPerformRequest, setNeedToPerformRequest] = useState(false);

  const dispatch = useDispatch();
  const session = useSelector(state => state.session);
  const requestHistory = useSelector(state => state.requestHistory);

  const mainRef = useRef();

  const handleChange = (newValue) => {
    setRequestJSON(newValue);
  }

  const formatRequest = () => {
    if (!validateRequest()) {
      return;
    }

    setRequestJSON(
      formatJSON(JSON.parse(requestJSON))
    );
  }

  const handleResponse = ({ request, response, status }) => {
    setResponseJSON(formatJSON(response));
    setResponseValidity(status);

    const historyItem = {
      request,
      response,
      status
    };

    // проверяем, выполнялся ли подобный запрос ранее
    // (есть ли он в истории запросов)
    const includedElement = requestHistory.filter(item =>
      isEqual(item.request, historyItem.request)
    );

    // если такого запроса ещё нет в истории
    // то  переходим к добавлению запроса в начало истории
    if (includedElement.length === 0) {
      // если в истории уже есть максимум запросов или меньше,
      // то выполняем добавление запроса в историю
      if (requestHistory.length < 15) {
        dispatch({
          type: 'prependRequestToHistory',
          historyItem
        })
      }
    // если запрос уже есть в истории,
    // то выполняем перенос запроса в начало истории
    } else {
      dispatch({
        type: 'prependExistingRequestToHistory',
        historyItem: includedElement[0]
      })
    }
  }

  const performRequest = () => {
    if (!validateRequest()) {
      return;
    }

    const request = JSON.parse(requestJSON);

    sendsay.request({
      ...request,
      ...{ session: session }
    }).then(
      // успешный запрос
      response => handleResponse({ request, response, status: true }),
      // запрос с ошибкой
      response => handleResponse({ request, response, status: false })
    ).catch(error =>
      console.log(error)
    )
  }

  const validateRequest = () => {
    let result = true;
    try {
      JSON.parse(requestJSON);
    } catch (error) {
      result = false;
    }

    // сайд эффектом проверки валидности запроса
    // задаётся состояние isRequestValid
    setRequestValidity(result);

    return result;
  }

  const loadRequestFromHistory = (historyItem) => {
    setRequestJSON(formatJSON(historyItem.request));
    setResponseJSON(formatJSON(historyItem.response));
    setRequestValidity(true);
    setResponseValidity(historyItem.status);
  }

  const executeRequestFromHistory = (historyItem) => {
    setRequestJSON(formatJSON(historyItem.request));
    setNeedToPerformRequest(true);
  }

  const performRequestCallback = useCallback(performRequest);

  useEffect(() => {
    setRequestEmptiness(requestJSON.trim().length === 0);
  }, [requestJSON])

  useEffect(() => {
    if (needToPerformRequest) {
      performRequestCallback();
    }

    return () => setNeedToPerformRequest(false);
  }, [needToPerformRequest, performRequestCallback])

  return (
    <main className="console" ref={mainRef}>
      <Header className="console__header" mainRef={mainRef} />
      <History
        className="console__history"
        onLoadRequestFromHistory={loadRequestFromHistory}
        onExecuteRequestFromHistory={executeRequestFromHistory}
      />
      <EditorsSet
        className="console__editors-set"
        handleChange={handleChange}
        requestValue={requestJSON}
        isRequestValid={isRequestValid}
        isResponseValid={isResponseValid}
        isRequestEmpty={isRequestEmpty}
        responseValue={responseJSON}
      />
      <Actions
        className="console__actions"
        performRequest={performRequest}
        requestJSON={requestJSON}
        formatRequest={formatRequest}
        isDisabled={isRequestEmpty}
      />
    </main>
  );
}

export { Console };
