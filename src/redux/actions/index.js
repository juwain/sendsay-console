import { isEqual } from '../../utils';

export const actionTypes = {
  // user
  LOGIN: 'login',
  LOGOUT: 'logout',
  SET_USER_DATA: 'setUserData',

  // history
  REPLACE_HISTORY: 'replaceHistory',
  REMOVE_REQUEST_FROM_HISTORY: 'removeRequestFromHistory',
  CLEAR_HISTORY: 'clearHistory',

  // editors
  SET_EDITORS_RESIZE_DELTA: 'setEditorsResizeDelta'
}


// action creators
export const prependRequestToHistory = (requestHistory, newHistoryItem) => {
  // // работаем с копией массива истории запросов
  let requestHistoryCopy = requestHistory.slice();

  // проверяем, выполнялся ли подобный запрос ранее
  // (есть ли он в истории запросов)
  const includedElement = requestHistoryCopy.filter(item =>
    isEqual(item.request, newHistoryItem.request)
  );

  // если такого запроса ещё нет в истории
  // то  переходим к добавлению запроса в начало истории
  if (includedElement.length === 0) {
    // если в истории уже есть максимум запросов или меньше,
    // то выполняем добавление запроса в историю
    if (requestHistoryCopy.length < 15) {
      // добавляем элемент в начало массива
      requestHistoryCopy.unshift(newHistoryItem);
    }
    // если запрос уже есть в истории,
    // то выполняем перенос запроса в начало истории
  } else {
    // убираем элемент и массива
    requestHistoryCopy = requestHistoryCopy.filter(item =>
      !isEqual(item.request, newHistoryItem.request)
    );

    // а затем добавляем элемент в начало
    requestHistoryCopy.unshift(newHistoryItem);
  }

  return {
    type: actionTypes.REPLACE_HISTORY,
    requestHistory: requestHistoryCopy
  }
}
