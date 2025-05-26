// src/lib/aws-config.ts
import { config, DynamoDB, CognitoIdentityServiceProvider, S3 } from 'aws-sdk';
import crypto from 'crypto';
import { getConfigValue } from './config-helper';

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
  userPoolId: getConfigValue('COGNITO_USER_POOL_ID', 'userPoolId'),
  userPoolClientId: getConfigValue('COGNITO_CLIENT_ID', 'userPoolClientId'),
  userPoolClientSecret: getConfigValue('COGNITO_CLIENT_SECRET', 'userPoolClientSecret'),
  tasksTable: getConfigValue('TASKS_TABLE', 'tasksTable'),
  attachmentsBucket: getConfigValue('ATTACHMENTS_BUCKET', 'attachmentsBucket'),
};

// 1) Initialize the AWS SDK globally with region & credentials
if (awsConfig.region) {
  config.update({
    region: awsConfig.region,
    credentials: {
      accessKeyId: getConfigValue('AWS_ACCESS_KEY_ID', 'accessKeyId'),
      secretAccessKey: getConfigValue('AWS_SECRET_ACCESS_KEY', 'secretAccessKey'),
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
