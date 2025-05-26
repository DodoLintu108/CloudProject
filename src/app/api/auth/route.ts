// src/app/api/auth/route.ts
import { NextResponse } from 'next/server';
import { awsConfig, cognitoISP, makeSecretHash } from '@/lib/aws-config';

export async function POST(request: Request) {
  const { action, username, password, email, code } = await request.json();

  // Validate AWS configuration
  if (!awsConfig.userPoolId || awsConfig.userPoolId === 'us-east-1_PLACEHOLDER' || 
      !awsConfig.userPoolClientId || awsConfig.userPoolClientId === 'PLACEHOLDER_CLIENT_ID') {
    return NextResponse.json({ 
      error: 'AWS Cognito configuration is not properly set. Please configure environment variables or use Amplify outputs.' 
    }, { status: 503 });
  }

  try {
    switch (action) {
      case 'signup':
        await cognitoISP.signUp({
          ClientId: awsConfig.userPoolClientId,
          Username: username,
          Password: password,
          SecretHash: makeSecretHash(username),
          UserAttributes: [{ Name: 'email', Value: email }],
        }).promise();
        return NextResponse.json({ message: 'Sign-up successful' }, { status: 201 });

      case 'confirm':
        // Compute secret hash if client has a secret
        const confirmSecretHash = makeSecretHash(username);
        await cognitoISP.confirmSignUp({
          ClientId: awsConfig.userPoolClientId,
          Username: username,
          ConfirmationCode: code,
          ...(confirmSecretHash && { SecretHash: confirmSecretHash }),
        }).promise();
        return NextResponse.json({ message: 'Confirmation successful' });

      case 'signin':
        // Compute secret hash if client has a secret
        const secretHash = makeSecretHash(username);
        const auth = await cognitoISP.adminInitiateAuth({
          AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
          UserPoolId: awsConfig.userPoolId,
          ClientId: awsConfig.userPoolClientId,
          AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
            ...(secretHash && { SECRET_HASH: secretHash }),
          },
        }).promise();
        return NextResponse.json(auth.AuthenticationResult);

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
