import {
  GET_ALL_EVENTS,
  SET_CURRENT_EVENT,
  UPDATE_BASIC_FORM
} from "../actions/types";

const initialState = {
  allEvents: {},
  currEvent: null,
  currEventType: null,
  basicForm: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_EVENTS:
      return {
        ...state,
        allEvents: action.payload
      };
    case SET_CURRENT_EVENT:
      return {
        ...state,
        currEvent: action.payload.event,
        currEventType: action.payload.type
      };
    case UPDATE_BASIC_FORM:
      return {
        ...state,
        basicForm: action.payload
      };
    default:
      return state;
  }
}
