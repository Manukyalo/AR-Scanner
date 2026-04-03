import { db } from '../src/firebase/config.js';
import { collection, doc, setDoc } from 'firebase/firestore';

const seedData = async () => {
  const restaurantId = 'test-restaurant';
  const restaurantRef = doc(db, 'restaurants', restaurantId);

  // 1. Seed Restaurant
  await setDoc(restaurantRef, {
    name: 'La Gourmandise',
    location: 'Downtown Paris',
    description: 'Immersive culinary experiences.'
  });

  // 2. Seed Dishes
  const dishes = [
    {
      id: 'burger',
      name: 'Premium Wagyu Burger',
      price: 24,
      category: 'Main',
      description: 'Aged beef with truffle mayo.',
      modelUrl: '/models/burger.glb'
    },
    {
      id: 'pasta',
      name: 'Truffle Tagliatelle',
      price: 32,
      category: 'Main',
      description: 'Hand-made pasta with fresh truffle.',
      modelUrl: '/models/pasta.glb'
    }
  ];

  for (const dish of dishes) {
    const dishRef = doc(collection(db, `restaurants/${restaurantId}/dishes`), dish.id);
    await setDoc(dishRef, dish);
  }

  console.log('✅ Firestore seeded successfully!');
};

seedData().catch(console.error);
