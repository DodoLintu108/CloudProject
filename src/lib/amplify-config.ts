// src/lib/amplify-config.ts
import { Amplify } from 'aws-amplify';
import { amplifyOutputs } from './amplify-outputs';

// Configure Amplify with the generated outputs
if (amplifyOutputs) {
  Amplify.configure(amplifyOutputs);
}

export default Amplify;
