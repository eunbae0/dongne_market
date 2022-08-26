import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useRecoilValue } from 'recoil';
import { auth } from '../../firebase.config';
import { isUserLogin, authCurrentStep } from '../../recoil/state';

function Write() {
  const isLogin = useRecoilValue(isUserLogin);
  const router = useRouter();

  const redirectLoginPage = () => {
    alert('로그인 후 이용해주세요');
    router.push('/auth');
  };

  useEffect(() => {
    if (!isLogin) {
      router.prefetch('/auth');
      redirectLoginPage();
    }
  }, []);
  return (
    <div>
      <input type="text" placeholder="제목" />
      <input type="text" placeholder="내용" />
    </div>
  );
}

export default Write;
