

import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Application from './Application';
import { store } from './redux/store';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CacheProvider, } from "@emotion/react";
import createCache from "@emotion/cache";

import "src/style/global.css";


const nonce = document.head.querySelector('[property~=csp-nonce][content]')?.getAttribute('content') as string;
const cache = createCache({
  key: 'my-prefix-key',
  prepend: true,
  nonce,
});

ReactDOM.render(
  <CacheProvider value={cache}>
    <React.StrictMode>
      <DndProvider backend={HTML5Backend}>
        <CssBaseline />
        <Provider store={store}>
          <Application />
        </Provider>
      </DndProvider>
    </React.StrictMode>
  </CacheProvider>,
  document.getElementById('root')
);
