import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDCPvoAxDyiyckt4BC9LYYdEH0CR-SUWUE',
  authDomain: 'simis-project.firebaseapp.com',
  projectId: 'simis-project',
  storageBucket: 'simis-project.appspot.com',
  messagingSenderId: '101528085433',
  appId: '1:101528085433:web:a1d78501bad2a28d274c68',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const authFirebase = getAuth();
export const storage = getStorage();
export const db = getFirestore();
