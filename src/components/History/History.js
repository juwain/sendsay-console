import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../Button/Button';
import { RequestDropdown } from '../RequestDropdown/RequestDropdown';
import { Scrollable } from '../Scrollable/Scrollable';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import { formatJSON } from '../../utils';
import { ReactComponent as IconCross } from './icon-cross.svg';
import './History.css';

const History = ({
    className,
    onLoadRequestFromHistory,
    onExecuteRequestFromHistory
  }) => {

  const dispatch = useDispatch();
  const requestHistory = useSelector(state => state.requestHistory);

  const clearHistory = () => dispatch({
    type: 'clearHistory'
  });

  const handleLoad = (historyItem) => onLoadRequestFromHistory(historyItem);

  const handleExecute = (historyItem) => onExecuteRequestFromHistory(historyItem);

  const handleCopy = (historyItem, callback) => {
    navigator.clipboard.writeText(formatJSON(historyItem.request)).catch(error =>
      console.log(error)
    ).finally(callback);
  }

  const handleDelete = ({ request }) => {
    dispatch({
      type: 'removeRequestFromHistory',
      request
    });
  }

  const dropdownDataSource = [
    [
      { text: 'Выполнить', onClick: handleExecute },
      { text: 'Скопировать', onClick: handleCopy, withNotificationCallback: true }
    ],
    [
      { text: 'Удалить', onClick: handleDelete, isDestructive: true}
    ]
  ];

  return (
    <div className={`${className} history`}>
      <Scrollable className="history__container" childClassName="history__items">
        {requestHistory && requestHistory.map(historyItem =>
          <RequestDropdown
            onClick={handleLoad}
            dropdownDataSource={dropdownDataSource}
            historyItem={historyItem}
            className="history__item"
            key={
              historyItem.status ?
                // валидный запрос возвращает request.id,
                // который тут и используется
                historyItem.response['request.id']
              :
                // невалидный запрос не возвращает request.id,
                // поэтому id нужно сгенерировать
                historyItem.response.id + uuidv4()
            }
          />
        )}
      </Scrollable>
      {requestHistory && requestHistory.length > 0 &&
        <div className="history__button-wrap">
            <Button className="button--transparent button--rounded button--padded" onClick={clearHistory}>
            <VisuallyHidden>Очистить историю запросов</VisuallyHidden>
            <IconCross />
          </Button>
        </div>
      }
    </div>
  );
}

export { History };
