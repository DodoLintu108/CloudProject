import { Amplify } from 'aws-amplify';
import awsConfig from './awsConfig';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConfirmEmailForm from './confirm';
import Tasks from './Tasks';

import SignInForm from './login';
import SignUpForm from './signup';

Amplify.configure(awsConfig);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/confirm" element={<ConfirmEmailForm />} /> 
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
