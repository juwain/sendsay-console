import { isEqual } from '../../utils';
import { actionTypes } from '../actions';

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
    case actionTypes.REPLACE_HISTORY:
      return {
        ...state,
        requestHistory: action.requestHistory
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

