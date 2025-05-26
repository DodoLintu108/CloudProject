// src/lib/aws-config.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import crypto from 'crypto';
import { getConfigValue } from './config-helper';
import { amplifyOutputs } from './amplify-outputs';

export interface AwsConfig {
  region: string;
  userPoolId: string;
  userPoolClientId: string;
  userPoolClientSecret?: string;
  identityPoolId?: string;
  tasksTable: string;
  attachmentsBucket: string;
}

export const awsConfig: AwsConfig = {
  region: amplifyOutputs?.auth?.aws_region || process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  userPoolId: amplifyOutputs?.auth?.user_pool_id || getConfigValue('COGNITO_USER_POOL_ID', 'userPoolId'),
  userPoolClientId: amplifyOutputs?.auth?.user_pool_client_id || getConfigValue('COGNITO_CLIENT_ID', 'userPoolClientId'),
  userPoolClientSecret: getConfigValue('COGNITO_CLIENT_SECRET', 'userPoolClientSecret'),
  identityPoolId: amplifyOutputs?.auth?.identity_pool_id,
  tasksTable: amplifyOutputs?.data?.tables?.Task?.name || getConfigValue('TASKS_TABLE', 'tasksTable'),
  attachmentsBucket: amplifyOutputs?.storage?.bucket_name || getConfigValue('ATTACHMENTS_BUCKET', 'attachmentsBucket'),
};

// Create credentials provider for unauthenticated access
const createCredentialsProvider = () => {
  if (awsConfig.identityPoolId) {
    return fromCognitoIdentityPool({
      clientConfig: { region: awsConfig.region },
      identityPoolId: awsConfig.identityPoolId,
    });
  }
  
  // Fallback for development environment
  const accessKeyId = getConfigValue('AWS_ACCESS_KEY_ID', 'accessKeyId');
  const secretAccessKey = getConfigValue('AWS_SECRET_ACCESS_KEY', 'secretAccessKey');
  
  if (accessKeyId && secretAccessKey) {
    return {
      accessKeyId,
      secretAccessKey,
    };
  }
  
  // If no credentials available, return undefined and let AWS SDK handle it
  return undefined;
};

// Create AWS SDK v3 clients
const credentials = createCredentialsProvider();
const clientConfig = {
  region: awsConfig.region,
  ...(credentials && { credentials }),
};

const dynamoClient = new DynamoDBClient(clientConfig);
export const dynamoDb = DynamoDBDocumentClient.from(dynamoClient);
export const s3 = new S3Client(clientConfig);
export const cognitoISP = new CognitoIdentityProvider(clientConfig);

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
