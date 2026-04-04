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
      id: 'caviar',
      name: 'Osetra Caviar Service',
      price: 150,
      category: 'Appetizers',
      description: 'Royal Osetra Caviar served on a hand-carved ice block, accompanied by traditional blinis, organic crème fraîche, and a mother-of-pearl spoon.',
      calories: 220,
      isVeg: false,
      ingredients: ['Osetra Caviar', 'Buckwheat Blinis', 'Chives', 'Crème Fraîche'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600',
      modelUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/pearl/model.gltf'
    },
    {
      id: 'gold-steak',
      name: '24K Gold Tomahawk',
      price: 850,
      category: 'Mains',
      description: 'Dry-aged Wagyu Tomahawk steak, leafed in 24-karat edible gold. Carved tableside for an unparalleled sensory experience.',
      calories: 1450,
      isVeg: false,
      ingredients: ['Aged Wagyu', '24K Gold Leaf', 'Truffle Salt', 'Bone Marrow'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=600',
      modelUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/steak/model.gltf'
    },
    {
      id: 'tuna-tartare',
      name: 'Blue Fin Otoro Tartare',
      price: 55,
      category: 'Appetizers',
      description: 'Premium Blue Fin fatty tuna hand-chopped with Asian pear, fresh wasabi, and a drizzle of 25-year-aged balsamic.',
      calories: 380,
      isVeg: false,
      ingredients: ['Blue Fin Tuna', 'Asian Pear', 'Yuzu Poke Sauce', 'Black Sesame'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
      modelUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/wooden-bowl-with-food/model.gltf'
    },
    {
      id: 'lobster-risotto',
      name: 'Saffron Lobster Risotto',
      price: 72,
      category: 'Mains',
      description: 'Acquerello rice infused with pure Persian saffron, topped with butter-poached Maine lobster and edible flowers.',
      calories: 580,
      isVeg: false,
      ingredients: ['Maine Lobster', 'Saffron', 'Carnaroli Rice', 'Sea Buckthorn'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1534080391025-097d4c80710d?auto=format&fit=crop&q=80&w=600',
      modelUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/shrimp/model.gltf'
    },
    {
      id: 'black-truffle-macaron',
      name: 'Diamond Truffle Macaron',
      price: 45,
      category: 'Desserts',
      description: 'Large-scale macaron filled with dark chocolate ganache and shavings of fresh Italian Perigord black truffle.',
      calories: 310,
      isVeg: true,
      ingredients: ['Dark Chocolate', 'Black Truffle', 'Gold Dust', 'Almond Flour'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=600',
      modelUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/cookie/model.gltf'
    },
    {
      id: 'vintage-champagne',
      name: 'Vintage Dom Pérignon',
      price: 1200,
      category: 'Beverages',
      description: 'The pinnacle of luxury. A full-bodied vintage champagne with notes of stone fruit and toasted brioche.',
      calories: 450,
      isVeg: true,
      ingredients: ['Chardonnay', 'Pinot Noir', 'Time'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600',
      modelUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/champagne-glass/model.gltf'
    }
  ];

  for (const dish of dishes) {
    const dishRef = doc(collection(db, `restaurants/${restaurantId}/dishes`), dish.id);
    await setDoc(dishRef, dish);
  }

  console.log('✅ Firestore seeded with premium data!');
};

seedData().catch(console.error);
