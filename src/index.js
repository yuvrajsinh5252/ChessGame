import React from 'react';
import ReactDOM from 'react-dom/client';
import Game from './Game';
import { Provider } from 'react-redux';
import store from './Store/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Game />
        </Provider>
    </React.StrictMode>
);