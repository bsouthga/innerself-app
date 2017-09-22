import html from 'innerself';
import { connect, State } from '../store';
import { Counter } from './counter';

export const App = connect(
  (state: State) => html`
  <div class="container">
    <div class="header">
      <img src="logo.png" />
      <h2>
        you've used an innerself app ${state.count} times...
      </h2>
    </div>
    ${Counter()}
  </div>
`
);
