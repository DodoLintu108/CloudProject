// src/lib/amplify-outputs.ts
// This file handles loading the Amplify outputs safely

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
    tables?: {
      [key: string]: {
        name: string;
        arn: string;
      };
    };
  };
  storage?: {
    aws_region?: string;
    bucket_name?: string;
  };
}

// Load amplify outputs from the actual deployed configuration
export const amplifyOutputs: AmplifyOutputs = {
  auth: {
    user_pool_id: "us-east-1_9tcHGi27T",
    aws_region: "us-east-1",
    user_pool_client_id: "55uecj5bes47d6ds301gqgf0er",
    identity_pool_id: "us-east-1:b5de0bbb-c969-499d-b230-faff8c07cc5d"
  },
  data: {
    url: "https://mv2jyv35enefvcolpnqlawk4uq.appsync-api.us-east-1.amazonaws.com/graphql",
    aws_region: "us-east-1"
  }
};
