// index.js or App.js
import { Amplify } from 'aws-amplify';
import { awsConfig } from './aws-config';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConfirmEmailForm from './confirm';

import SignInForm from './login';
import SignUpForm from './signup';

Amplify.configure({
  Auth: {
    ...awsConfig,
  },
});

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/confirm" element={<ConfirmEmailForm />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
