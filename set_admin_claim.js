import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Replace with your service account JSON filename if different
const SERVICE_ACCOUNT_FILE = 'service-account.json';
const targetUid = '5aildTghkdSExbwJ7QbYDDjdS9i2';

async function main() {
  try {
    const serviceAccountPath = join(__dirname, SERVICE_ACCOUNT_FILE);
    console.log(`Reading service account from: ${serviceAccountPath}`);
    
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log(`Setting custom claim { isAdmin: true } for UID: ${targetUid}...`);
    await admin.auth().setCustomUserClaims(targetUid, { isAdmin: true });
    
    console.log('✅ Successfully granted administrator access to UID:', targetUid);
    
    // Verify the claims
    const userRecord = await admin.auth().getUser(targetUid);
    console.log('Current custom claims for this user:', userRecord.customClaims);
  } catch (error) {
    console.error('❌ Error setting admin claims:', error.message);
    console.log('\n💡 Hint: Please download your Firebase service account JSON key file:');
    console.log('1. Go to Firebase Console -> Project Settings -> Service Accounts');
    console.log('2. Click "Generate new private key"');
    console.log(`3. Rename the downloaded file to "${SERVICE_ACCOUNT_FILE}" and save it in the root folder of this project.`);
    console.log('4. Run this script again: node set_admin_claim.js');
  }
}

main();
