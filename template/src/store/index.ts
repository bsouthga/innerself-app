import { createStore } from 'innerself';
import { reducer } from './reducer';
import { Action } from './actions';

const { dispatch: originalDispatch, connect, attach } = createStore(reducer);

/**
 *
 * attach dispatch function to window for use in element events
 *
 */
declare global {
  interface Window {
    dispatch: typeof dispatch;
  }
}
window.dispatch = dispatch;

export function dispatch(action: Action): void;
export function dispatch(action: Action, toString: true): string;
/**
 * convenience wrapper for components
 *
 * @param action application action
 * @param toString whether or not to produce a string (for element events)
 */
export function dispatch(action: Action, toString?: boolean) {
  if (toString) {
    const actionString = JSON.stringify(action);
    return `'event.preventDefault();dispatch(${actionString})';`;
  }

  return originalDispatch(action);
}

export * from './state';
export * from './actions';
export { connect, attach };
