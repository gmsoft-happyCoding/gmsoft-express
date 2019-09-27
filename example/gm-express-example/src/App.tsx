import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { stateContainer } from './utils';
import PlayGround from './components/PlayGround/PlayGround';

const App = () => (
  <Provider store={stateContainer._store}>
    <Router history={stateContainer._history}>
      <>
        <PlayGround />
      </>
    </Router>
  </Provider>
);

export default hot(App);
