const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: 'ap-southeast-1'
});

const checkAWSConfiguration = async () => {
  try {
    const sts = new AWS.STS();
    const identity = await sts.getCallerIdentity().promise();
    console.log('AWS SDK Configuration Successful:', identity);
  } catch (error) {
    console.error('AWS SDK Configuration Error:', error);
  }
};

checkAWSConfiguration();
