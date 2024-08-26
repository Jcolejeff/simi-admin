import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyAP0IalCnyFRTXVOibXdrkhL6-7ys4-lzg",
  authDomain: "simi-blog.firebaseapp.com",
  projectId: "simi-blog",
  storageBucket: "simi-blog.appspot.com",
  messagingSenderId: "206227647595",
  appId: "1:206227647595:web:9d041bb92456c85875d52e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const authFirebase = getAuth();
export const storage = getStorage();
export const db = getFirestore();
