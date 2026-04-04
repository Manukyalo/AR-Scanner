import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';
import { join } from 'path';

// Manual .env loading for Node.js environment
const envPath = join(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const registerAdmin = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(`✅ Admin account created successfully!`);
    console.log(`Email: ${email}`);
    console.log(`Now you can log into the Admin Suite at your Vercel URL.`);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️ This email is already registered.');
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
  }
};

// Default credentials if not provided as arguments
const adminEmail = process.argv[2] || 'admin@luxuryar.com';
const adminPassword = process.argv[3] || 'LuxuryAdmin123';

console.log('Initializing Admin Registration...');
registerAdmin(adminEmail, adminPassword);
