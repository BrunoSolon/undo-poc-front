import undoable from "redux-undo";
import { PersonActions } from "../actions";

const defaultState = {
  person: [],
};
const person = (state = defaultState, action) => {
  switch (action.type) {
    case PersonActions.ACTION_REFRESH_PERSON:
      return {
        ...state,
        person: action.person,
      };
    default:
      return state;
  }
};

const undoablePerson = undoable(person, { ignoreInitialState: true, limit: 1 });

export function getPerson(state) {
  console.log('------------', state.home);
  return state.home.present.person;
}

export function getUndoPast(state) {
  return state.home.past[0]?.person;
}

export function canUndo(state) {
  return state.home.past.length;
}


export default undoablePerson;
