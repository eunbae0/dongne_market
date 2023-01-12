/* eslint-disable react/jsx-props-no-spreading */
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from '../components/layout/layout';
import { auth } from '../../firebase.config';

import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  );
}
// App.getInitialProps = async (appContext: AppContext) => {
//   const appProps: AppProps = await App.getInitialProps(appContext);
//   return { ...appProps };
// };

export async function getServerSideProps() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const setIsLogin = useSetRecoilState(isUserLogin);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      // setIsLogin(true);
      // setIsLoginLoading(true);
      console.log('ssr');
    } else {
      // User is signed out
      // setIsLogin(false);
      console.log('ssr');
      // setIsLoginLoading(true);
    }
  });
  const data = 'hi';
  return {
    props: { data }, // will be passed to the page component as props
  };
}

export default App;
