import { isEqual } from '../../utils';

const MAX_HISTORY_SIZE = 15;

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
  // работаем с копией массива истории запросов
  let requestHistoryCopy = requestHistory.slice();

  // проверяем на ограничение по количеству элементов в истории
  if (requestHistoryCopy.length < MAX_HISTORY_SIZE) {
    // проверяем, выполнялся ли подобный запрос ранее
    // (есть ли он в истории запросов)
    const foundElement = requestHistoryCopy.find(item =>
      isEqual(item.request, newHistoryItem.request)
    );

    // если элемент есть в истории, то убираем элемент из массива
    if (foundElement) {
      requestHistoryCopy = requestHistoryCopy.filter(item =>
        !isEqual(item.request, newHistoryItem.request)
      );
    }

    // добавляем элемент первым в массив
    requestHistoryCopy.unshift(newHistoryItem);
  }

  return {
    type: actionTypes.REPLACE_HISTORY,
    requestHistory: requestHistoryCopy
  }
}
