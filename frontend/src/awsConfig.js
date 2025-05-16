// frontend/src/awsConfig.js
export default {
  Auth: {
    region:             process.env.REACT_APP_AWS_REGION,
    userPoolId:         process.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolClientId:   process.env.REACT_APP_COGNITO_CLIENT_ID,    // ← renamed
    oauth: {
      domain:          process.env.REACT_APP_COGNITO_DOMAIN,
      scope:           ['openid', 'email'],
      redirectSignIn:  process.env.REACT_APP_CALLBACK_URL,
      redirectSignOut: process.env.REACT_APP_LOGOUT_URL,
      responseType:    'code'
    }
  }
};
