import mongoose from 'mongoose';

const MONGODB_URI = process.env.NEXT_PUBLIC_DB_URL!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let isConnected = false; // Track connection status

export const connectToDB = async () => {
  if (isConnected) {
    // If already connected, return
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);

    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to the database');
  }
};
