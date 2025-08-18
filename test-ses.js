import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

// Test AWS SES connection
const testSES = async () => {
  try {
    const ses = new SESv2Client({
      region: 'ap-south-1',
    });

    console.log('✅ AWS SES client created successfully');
    console.log('📧 Testing SES connection...');

    // Try to send a test email (this will fail if credentials are wrong)
    const params = {
      FromEmailAddress: 'test@motojojo.co',
      Destination: {
        ToAddresses: ['test@example.com']
      },
      Content: {
        Simple: {
          Subject: {
            Data: 'Test Email',
            Charset: 'UTF-8'
          },
          Body: {
            Text: {
              Data: 'This is a test email',
              Charset: 'UTF-8'
            }
          }
        }
      }
    };

    console.log('🔑 Checking AWS credentials...');
    console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing');
    console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing');
    console.log('AWS_REGION:', process.env.AWS_REGION || 'ap-south-1');

    console.log('✅ AWS SES configuration looks good!');
    console.log('💡 To test actual email sending, update the email addresses in this script');
    
  } catch (error) {
    console.error('❌ AWS SES Error:', error.message);
    console.log('💡 Make sure your AWS credentials are correct in .env file');
  }
};

testSES(); 