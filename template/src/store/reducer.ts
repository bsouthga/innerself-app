import { State } from './state';
import { Action, INCREMENT, DECREMENT, INIT } from './actions';

/**
 * initial state for app
 */
const initialState: State = {
  count: 0
};

/**
 *
 * main application reducer
 *
 */
export function reducer(
  state: State = initialState,
  action: Action = { type: INIT }
) {
  switch (action.type) {
    case INCREMENT: {
      return {
        count: state.count + action.payload.amount
      };
    }
    case DECREMENT: {
      return {
        count: state.count - action.payload.amount
      };
    }

    default:
      return state;
  }
}
