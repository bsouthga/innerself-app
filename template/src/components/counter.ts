import html from 'innerself';
import { connect, dispatch, increment, decrement, State } from '../store';

export const Counter = connect(
  (state: State) =>
    html`
    <div class="counter">
      <button onclick=${dispatch(increment(1), true)}>
        increment
      </button>
      <button onclick=${dispatch(decrement(1), true)}>
        decrement
      </button>
    </div>
  `
);
