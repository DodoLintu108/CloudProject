import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main style={{ padding: 20 }}>
          <h1>Welcome, {user.username}!</h1>
          <button onClick={signOut}>Sign Out</button>
        </main>
      )}
    </Authenticator>
  );
}
