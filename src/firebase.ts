import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
        apiKey: 'AIzaSyAzQUDyCiCvvyqsDE-dKCXo2dgzREpHMZA',
        authDomain: 'spk-pranata.firebaseapp.com',
        projectId: 'spk-pranata',
        storageBucket: 'spk-pranata.appspot.com',
        messagingSenderId: '581711870878',
        appId: '1:581711870878:web:e1423d9c8eb6588e01348f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
