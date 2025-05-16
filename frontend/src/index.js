// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import awsConfig from './awsConfig';

import App from './App';
import './index.css';

Amplify.configure(awsConfig);
// Create and render root with ReactDOM client API
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
