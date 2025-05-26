'use client';

import { Amplify } from 'aws-amplify';
import { useEffect } from 'react';
import { amplifyConfig } from '@/lib/amplify-config';

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Configure Amplify on the client side
    try {
      Amplify.configure(amplifyConfig, {
        ssr: true
      });
      console.log('Amplify configured successfully');
    } catch (error) {
      console.error('Could not configure Amplify:', error);
    }
  }, []);

  return <>{children}</>;
}
