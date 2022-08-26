import { useState, useLayoutEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useSetRecoilState } from 'recoil';
import Navbar from './nav';
import Footer from './footer';

import { isUserLogin } from '../../recoil/state';
import { auth } from '../../firebase.config';

export default function Layout({ children }) {
  const setIsLogin = useSetRecoilState(isUserLogin);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  useLayoutEffect(() => {
    setIsLoginLoading(false);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setIsLogin(true);
        setIsLoginLoading(true);
      } else {
        // User is signed out
        setIsLogin(false);
        setIsLoginLoading(true);
      }
    });
  }, []);
  return (
    <div className="h-screen relative">
      <Navbar isLoginLoading={isLoginLoading} />
      <main className="h-screen">{children}</main>
      <Footer />
    </div>
  );
}
