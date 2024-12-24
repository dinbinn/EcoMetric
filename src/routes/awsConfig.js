// awsConfig.js
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'ap-southeast-1_RL4uehTC5', 
  ClientId: 'hq8p1bh04gchbtfro0h5ahgr7' 
};

const userPool = new CognitoUserPool(poolData);

export { userPool };
