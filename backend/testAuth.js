// A quick script to list users in your pool (verifies AWS creds & IDs)
const { CognitoIdentityProviderClient, ListUsersCommand } =
  require('@aws-sdk/client-cognito-identity-provider');
const { region, userPoolId } = require('./src/config');

async function testListUsers() {
  const client = new CognitoIdentityProviderClient({ region });
  const cmd = new ListUsersCommand({ UserPoolId: userPoolId });
  try {
    const resp = await client.send(cmd);
    console.log('✅ Users in pool:', resp.Users.map(u => u.Username));
  } catch (err) {
    console.error('❌ Error listing users:', err);
  }
}

testListUsers();
    