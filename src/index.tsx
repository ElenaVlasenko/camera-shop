import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/app';
import store from './store/store';
import { fetchCamerasAction, fetchPromoAction } from './store/cameras-slice/cameras-slice';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

store.dispatch(fetchCamerasAction());
store.dispatch(fetchPromoAction());

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
