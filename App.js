import React from 'react';
import {Provider} from 'react-redux';
import store from './redux/store';
import CardManager from './screens/CardManager';

const App = () => {
  return (
    <Provider store={store}>
      <CardManager />
    </Provider>
  );
};
export default App;
