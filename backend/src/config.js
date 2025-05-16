require('dotenv').config();

module.exports = {
  region:     process.env.AWS_REGION,
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  clientId:   process.env.COGNITO_CLIENT_ID,
  domain:     process.env.COGNITO_DOMAIN,
};