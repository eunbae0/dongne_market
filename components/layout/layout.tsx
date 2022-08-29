import { useMemo, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useSetRecoilState } from 'recoil';
import { getDoc, doc } from 'firebase/firestore';
import Navbar from './nav';
import Footer from './footer';

import { userInfo } from '../../recoil/state';
import { auth, db } from '../../firebase.config';

export default function Layout({ children }: { children: React.ReactNode }) {
  const setUserInfo = useSetRecoilState(userInfo);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  useMemo(() => {
    onAuthStateChanged(auth, async (user) => {
      setIsLoginLoading(false);
      if (user) {
        const { uid } = user as User;
        // https://firebase.google.com/docs/reference/js/firebase.User
        const userInfoDocSnap = await getDoc(doc(db, 'User', uid));
        if (userInfoDocSnap.exists()) {
          const { nickname } = userInfoDocSnap.data();
          const userLoginObj = {
            isLogin: true,
            uid,
            nickname,
          };
          setUserInfo(userLoginObj);
          setIsLoginLoading(true);
        } else {
          console.log('No such document!');
        }
      }
      // User is signed out
      else {
        const userLogoutObj = {
          isLogin: false,
          uid: '',
          nickname: '',
        };
        setUserInfo(userLogoutObj);
        setIsLoginLoading(true);
      }
    });
  }, [setUserInfo]);
  return (
    <div className="h-screen relative">
      <Navbar isLoginLoading={isLoginLoading} />
      {isLoginLoading && <main className="h-screen">{children}</main>}
      <Footer />
    </div>
  );
}
export async function getServerSideProps() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const isLogin = true;
      return {
        props: { isLogin, user },
      };
    }
    const isLogin = false;
    return {
      props: { isLogin, user },
    };
  });
}
