// frontend/src/index.js

// **This sets up** Amplify’s internal OAuth listener (loginWith)
import 'aws-amplify/auth/enable-oauth-listener';

import React from 'react';
import ReactDOM from 'react-dom';
import { Amplify } from 'aws-amplify';
import awsConfig from './awsConfig';
import App from './App';

Amplify.configure(awsConfig);

ReactDOM.render(<App />, document.getElementById('root'));
