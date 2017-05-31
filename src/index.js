import React from 'react';
import ReactDOM from 'react-dom';
import MessageBox from './MessageBox';

ReactDOM.render(
  <MessageBox
    url='http://localhost:3001/api/messages'
    pollInterval={1000} />,
  document.getElementById('root')
);