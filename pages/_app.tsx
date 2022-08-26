/* eslint-disable react/jsx-props-no-spreading */
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';

import Layout from '../components/layout/layout';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  );
}
export default MyApp;
