// src/lib/aws-config.ts
import { config, DynamoDB, CognitoIdentityServiceProvider } from 'aws-sdk';
import crypto from 'crypto';

export interface AwsConfig {
  region: string;
  userPoolId: string;
  userPoolClientId: string;
  userPoolClientSecret?: string;
  tasksTable: string;
}

export const awsConfig: AwsConfig = {
  region: process.env.AWS_REGION!,
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  userPoolClientId: process.env.COGNITO_CLIENT_ID!,
  userPoolClientSecret: process.env.COGNITO_CLIENT_SECRET,  // only if your client has a secret
  tasksTable: process.env.TASKS_TABLE!,
};

// 1) Initialize the AWS SDK globally with region & credentials
config.update({
  region: awsConfig.region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 2) Export your DynamoDB and Cognito clients
export const dynamoDb = new DynamoDB.DocumentClient();
export const cognitoISP = new CognitoIdentityServiceProvider();

/**
 * If you have a Cognito client secret, compute the SECRET_HASH
 * See Option B from earlier: https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminInitiateAuth.html
 */
export function makeSecretHash(username: string): string | undefined {
  const { userPoolClientSecret, userPoolClientId } = awsConfig;
  if (!userPoolClientSecret) return undefined;

  return crypto
    .createHmac('SHA256', userPoolClientSecret)
    .update(username + userPoolClientId)
    .digest('base64');
}
