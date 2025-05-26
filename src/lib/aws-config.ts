// src/lib/aws-config.ts
import { config, DynamoDB, CognitoIdentityServiceProvider, S3 } from 'aws-sdk';
import crypto from 'crypto';

export interface AwsConfig {
  region: string;
  userPoolId: string;
  userPoolClientId: string;
  userPoolClientSecret?: string;
  tasksTable: string;
  attachmentsBucket: string;
}

export const awsConfig: AwsConfig = {
  region: process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  userPoolId: process.env.COGNITO_USER_POOL_ID || process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'us-east-1_PLACEHOLDER',
  userPoolClientId: process.env.COGNITO_CLIENT_ID || process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'PLACEHOLDER_CLIENT_ID',
  userPoolClientSecret: process.env.COGNITO_CLIENT_SECRET,  // only if your client has a secret
  tasksTable: process.env.TASKS_TABLE || process.env.NEXT_PUBLIC_TASKS_TABLE || 'tasks-table',
  attachmentsBucket: process.env.ATTACHMENTS_BUCKET || process.env.NEXT_PUBLIC_ATTACHMENTS_BUCKET || 'attachments-bucket',
};

// 1) Initialize the AWS SDK globally with region & credentials
if (awsConfig.region) {
  config.update({
    region: awsConfig.region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'PLACEHOLDER_ACCESS_KEY',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'PLACEHOLDER_SECRET_KEY',
    },
  });
}

// 2) Export your DynamoDB and Cognito clients
export const dynamoDb = new DynamoDB.DocumentClient();
export const cognitoISP = new CognitoIdentityServiceProvider();
export const s3 = new S3();

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
