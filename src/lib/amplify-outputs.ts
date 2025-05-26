// src/lib/amplify-outputs.ts
// This file handles loading the Amplify outputs safely

import amplifyOutputsJson from '../../amplify_outputs.json';

export interface AmplifyOutputs {
  auth?: {
    user_pool_id?: string;
    aws_region?: string;
    user_pool_client_id?: string;
    identity_pool_id?: string;
  };
  data?: {
    url?: string;
    aws_region?: string;
  };
}

// Export the loaded outputs
export const amplifyOutputs: AmplifyOutputs = amplifyOutputsJson;
