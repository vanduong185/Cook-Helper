import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { App } from './App';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { viVN } from '@material-ui/core/locale';

const theme = createMuiTheme(undefined, viVN);

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
