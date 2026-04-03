import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
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
const db = getFirestore(app);

const seedData = async () => {
  const restaurantId = 'test-restaurant';
  const restaurantRef = doc(db, 'restaurants', restaurantId);

  // 1. Seed Restaurant with Premium Branding
  await setDoc(restaurantRef, {
    name: 'La Gourmandise',
    location: 'Downtown Paris',
    description: 'Immersive culinary experiences with a touch of modern AR.',
    logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100',
    brandColor: '#8b5cf6', // purple-500
    ctaLabel: 'Book a Table',
    ctaUrl: 'https://example.com/reserve'
  });

  // 2. Seed Dishes with Detailed Metadata
  const dishes = [
    {
      id: 'burger',
      name: 'Premium Wagyu Burger',
      price: 24,
      category: 'Burgers',
      description: 'Aged Wagyu beef patty, served with a perfect balance of savory truffle and sweet onion jam on a toasted brioche bun.',
      calories: 850,
      isVeg: false,
      ingredients: ['Wagyu Beef', 'Truffle Mayo', 'Caramelized Onion', 'Brioche Bun'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
      modelUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/burger/model.gltf'
    },
    {
      id: 'pasta',
      name: 'Truffle Tagliatelle',
      price: 32,
      category: 'Mains',
      description: 'Silky, hand-made tagliatelle pasta tossed in an exquisite, creamy black truffle sauce.',
      calories: 640,
      isVeg: true,
      ingredients: ['Fresh Tagliatelle', 'Black Truffle', 'Pecorino Romano'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=400',
      modelUrl: '/models/pasta.glb'
    },
    {
      id: 'salad',
      name: 'Mediterranean Quinoa',
      price: 18,
      category: 'Salads',
      description: 'Zesty quinoa with fresh cucumbers, cherry tomatoes, and kalamata olives.',
      calories: 320,
      isVeg: true,
      ingredients: ['Quinoa', 'Cucumber', 'Cherry Tomatoes', 'Feta Cheese'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
      modelUrl: '/models/salad.glb'
    }
  ];

  for (const dish of dishes) {
    const dishRef = doc(collection(db, `restaurants/${restaurantId}/dishes`), dish.id);
    await setDoc(dishRef, dish);
  }

  console.log('✅ Firestore seeded with premium data!');
};

seedData().catch(console.error);
