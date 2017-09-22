/**
 * app actions
 */
export type Action = IncrementAction | DecrementAction | InitAction;

/**
 * action types
 */
export const INIT = 'INIT';
export type INIT = typeof INIT;

export const INCREMENT = 'INCREMENT';
export type INCREMENT = typeof INCREMENT;

export const DECREMENT = 'DECREMENT';
export type DECREMENT = typeof DECREMENT;

type InitAction = {
  type: INIT;
};

type IncrementAction = {
  type: INCREMENT;
  payload: {
    amount: number;
  };
};

type DecrementAction = {
  type: DECREMENT;
  payload: {
    amount: number;
  };
};

/**
 *
 * app action creators
 *
 */

export const increment = (amount = 1): IncrementAction => ({
  type: INCREMENT,
  payload: { amount }
});

export const decrement = (amount = 1): DecrementAction => ({
  type: DECREMENT,
  payload: { amount }
});
