#!/usr/bin/env node

/**
 * Gmail Setup Script for NETSPIRE Contact Form
 * This script helps you configure Gmail for your contact form
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function createEnvFile(config) {
  const envContent = `# Gmail SMTP Configuration for NETSPIRE Contact Form
# Generated on ${new Date().toISOString()}

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=${config.email}
SMTP_PASS=${config.appPassword}
CONTACT_EMAIL=${config.contactEmail}

# Optional: Different reply-to email
REPLY_TO_EMAIL=${config.replyTo || config.contactEmail}
`;

  fs.writeFileSync('.env', envContent);
  console.log('\n✅ .env file created successfully!');
}

function updateGitignore() {
  const gitignorePath = '.gitignore';
  let gitignoreContent = '';
  
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  }

  if (!gitignoreContent.includes('.env')) {
    gitignoreContent += '\n# Environment variables\n.env\n.env.local\n.env.*.local\n';
    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log('✅ Updated .gitignore to exclude .env files');
  }
}

async function installDependencies() {
  console.log('\n📦 Installing email dependencies...');
  const { execSync } = require('child_process');
  
  try {
    execSync('npm install nodemailer @types/nodemailer', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully!');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    console.log('💡 Please run manually: npm install nodemailer @types/nodemailer');
  }
}

async function main() {
  console.log(`
🎯 NETSPIRE Gmail Setup Assistant
================================

This script will help you configure Gmail for your contact form.

📋 Before continuing, make sure you have:
1. ✅ A Gmail account
2. ✅ 2-Factor Authentication enabled
3. ✅ An App Password generated

If you haven't done these steps yet, please:
1. Go to myaccount.google.com
2. Click Security → 2-Step Verification → Enable it
3. Then go to App passwords → Generate password for "Mail"

`);

  const shouldContinue = await question('Do you have your Gmail App Password ready? (y/n): ');
  
  if (shouldContinue.toLowerCase() !== 'y') {
    console.log(`
📖 Setup Instructions:

1. Go to: https://myaccount.google.com
2. Click "Security" in the sidebar
3. Under "How you sign in to Google", click "2-Step Verification"
4. Enable 2-Step Verification (follow the prompts)
5. Scroll down and click "App passwords"
6. Select app: "Mail", device: "Windows Computer"
7. Click "GENERATE" and copy the 16-character password
8. Run this script again with your App Password

`);
    rl.close();
    return;
  }

  console.log('\n📧 Gmail Configuration\n');

  const config = {
    email: await question('Enter your Gmail address: '),
    appPassword: await question('Enter your Gmail App Password (16 characters): '),
    contactEmail: '',
    replyTo: ''
  };

  config.contactEmail = await question(`Enter email to receive contact forms (default: ${config.email}): `) || config.email;
  config.replyTo = await question('Enter reply-to email (optional, press Enter to skip): ');

  console.log('\n📝 Configuration Summary:');
  console.log(`Gmail Account: ${config.email}`);
  console.log(`App Password: ${'*'.repeat(config.appPassword.length)}`);
  console.log(`Contact Email: ${config.contactEmail}`);
  console.log(`Reply-To: ${config.replyTo || 'Same as contact email'}`);

  const confirm = await question('\nIs this correct? (y/n): ');
  
  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ Setup cancelled. Run the script again to retry.');
    rl.close();
    return;
  }

  // Create .env file
  createEnvFile(config);
  
  // Update .gitignore
  updateGitignore();
  
  // Install dependencies
  await installDependencies();

  console.log(`
🎉 Gmail Setup Complete!

✅ .env file created with your Gmail configuration
✅ .gitignore updated to protect your credentials
✅ Email dependencies installed

🚀 Next Steps:
1. Start your development server: npm run dev
2. Test the contact form at: http://localhost:4321
3. Check your Gmail inbox for test emails

🔧 Test Configuration:
Run this command to test your email setup:
node -e "
const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com', port: 587, secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});
transporter.sendMail({
  from: process.env.SMTP_USER, to: process.env.CONTACT_EMAIL,
  subject: 'NETSPIRE Contact Form Test', html: '<h1>✅ Email setup working!</h1>'
}).then(() => console.log('✅ Test email sent!')).catch(console.error);
"

🛡️ Security Notes:
- Your App Password is safely stored in .env (not tracked by Git)
- Never share your .env file or commit it to version control
- You can regenerate App Passwords anytime in your Google Account

Your contact form is now ready to send professional emails! 🎯
`);

  rl.close();
}

main().catch(console.error);
