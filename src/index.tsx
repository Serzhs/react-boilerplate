import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { QueryParamProvider } from 'use-query-params';
import reportWebVitals from './reportWebVitals';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';

ReactDOM.render(
  <React.StrictMode>
    <QueryParamProvider>
      <VideoPlayer />
    </QueryParamProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
