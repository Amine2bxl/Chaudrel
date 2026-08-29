import { renderToString } from 'react-dom/server';
import React from 'react';
import App from './App.jsx';

export function render() {
  return renderToString(<App />);
}
