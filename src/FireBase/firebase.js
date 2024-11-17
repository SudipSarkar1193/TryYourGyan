// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTH,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_ST_BCT,
  messagingSenderId: import.meta.env.VITE_M_S_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MES_ID,
};

/*
const firebaseConfig = {
  
};

*/
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogleAndGetUserInfo = async () => {
  const result = await signInWithPopup(auth, provider);
  console.log("Firebase Res", result);
  //const isNewUser = result.additionalUserInfo?.isNewUser;
  const isNewUser = result.additionalUserInfo?.isNewUser;
  const user = result.user;
  const userInfo = {
    username: user.displayName,
    email: user.email,
    profileImg: user.photoURL,
    firebaseId: user.uid,
  };
  const token = user.getIdToken();
  return { userInfo, token };
};
