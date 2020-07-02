import { isEqual } from '../../utils';
import { actionTypes } from '../actionTypes';

const initialState = {
  session: null,
  sublogin: null,
  account: null,
  requestHistory: [],
  editorsResizeDelta: 0
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    // user
    case actionTypes.LOGIN:
      return {
        ...state,
        session: action.session
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        session: null
      };
    case actionTypes.SET_USER_DATA:
      return {
        ...state,
        sublogin: action.userData.sublogin,
        account: action.userData.account
      };

    // history
    case actionTypes.PREPEND_REQUEST_TO_HISTORY:
      // работаем с копией массива истории запросов
      const requestHistoryCopy = state.requestHistory.slice();

      // добавляем элемент в начало массива
      requestHistoryCopy.unshift(action.historyItem);

      return {
        ...state,
        requestHistory: requestHistoryCopy
      };
    case actionTypes.PREPEND_EXISTING_REQUEST_TO_HISTORY:
      // работаем с копией массива истории запросов
      let requestHistoryFilteredCopy = state.requestHistory.slice();

      // убираем элемент и массива
      requestHistoryFilteredCopy = requestHistoryFilteredCopy.filter(item =>
        !isEqual(item.request, action.historyItem.request)
      );

      // а затем добавляем элемент в начало
      requestHistoryFilteredCopy.unshift(action.historyItem);
      return {
        ...state,
        requestHistory: requestHistoryFilteredCopy
      };
    case actionTypes.REMOVE_REQUEST_FROM_HISTORY:
      return {
        ...state,
        requestHistory: state.requestHistory.filter(item =>
          !isEqual(item.request, action.request)
        )
      };
    case actionTypes.CLEAR_HISTORY:
      return {
        ...state,
        requestHistory: []
    };

    // editors
    case actionTypes.SET_EDITORS_RESIZE_DELTA:
      return {
        ...state,
        editorsResizeDelta: state.editorsResizeDelta + action.delta
      };
    default:
      return state;
  }
}

