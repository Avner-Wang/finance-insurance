import React from 'react';
import { Router, useRouterHistory } from 'react-router';
import ReactDOM from 'react-dom';
import routes from './routes';
import { createHistory } from 'history';
import config from './config';

const browserHistory = useRouterHistory(createHistory)({
  basename: config.basename
})

ReactDOM.render(<Router history={browserHistory}>{routes}</Router>, document.getElementById('app'));
