'use client';

import { Amplify } from 'aws-amplify';
import { useEffect } from 'react';
import { amplifyOutputs } from '@/lib/amplify-outputs';

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Configure Amplify on the client side
    if (amplifyOutputs) {
      try {
        // Use the raw outputs format supported by Amplify v6
        Amplify.configure(amplifyOutputs, {
          ssr: true
        });
        console.log('Amplify configured successfully');
      } catch (error) {
        console.error('Could not configure Amplify:', error);
      }
    } else {
      console.log('No Amplify outputs available - using fallback configuration');
    }
  }, []);

  return <>{children}</>;
}
