// src/lib/amplify-config.ts
import { ResourcesConfig } from 'aws-amplify';

export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_9tcHGi27T',
      userPoolClientId: '55uecj5bes47d6ds301gqgf0er',
      identityPoolId: 'us-east-1:b5de0bbb-c969-499d-b230-faff8c07cc5d',
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: 'https://mv2jyv35enefvcolpnqlawk4uq.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'iam',
    },
  },
};
