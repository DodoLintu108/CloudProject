# AWS Environment Variables Setup for Amplify

This document explains how to configure the necessary environment variables for the AWS Task Management application to work properly in production.

## Required Environment Variables

You need to set the following environment variables in the AWS Amplify Console:

### Authentication (AWS Cognito)
- `COGNITO_USER_POOL_ID` - Your Cognito User Pool ID (e.g., us-east-1_xIpl3sIFI)
- `COGNITO_CLIENT_ID` - Your Cognito App Client ID (e.g., 4filua8kmuqvqhimtu6ij0rs1g)
- `COGNITO_CLIENT_SECRET` - Your Cognito App Client Secret (if using a client with secret)

### AWS Services
- `AWS_REGION` - AWS region where your resources are deployed (e.g., us-east-1)
- `AWS_ACCESS_KEY_ID` - AWS Access Key with appropriate permissions
- `AWS_SECRET_ACCESS_KEY` - AWS Secret Access Key
- `TASKS_TABLE` - DynamoDB table name for tasks (e.g., Tasks)
- `ATTACHMENTS_BUCKET` - S3 bucket name for file attachments (e.g., task-app-attachments-12345)

## How to Set Environment Variables in Amplify Console

1. Go to the AWS Amplify Console
2. Select your app (cloudproject)
3. Go to "App settings" > "Environment variables"
4. Add each environment variable with its corresponding value

## Local Development

For local development, these values are automatically loaded from the `.env.local` file when running in development mode. The production build requires these to be set in the Amplify Console.

## Security Note

Never commit real credentials to your repository. The development fallback values in the code should only be used for local development and testing.
