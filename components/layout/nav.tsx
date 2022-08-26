import { useRouter } from 'next/router';

import { signOut } from 'firebase/auth';
import { useRecoilValue } from 'recoil';
import { auth } from '../../firebase.config';

import { isUserLogin, authCurrentStep } from '../../recoil/state';

function Nav({ isLoginLoading }: { isLoginLoading: boolean }) {
  const isLogin = useRecoilValue(isUserLogin);
  const currentStep = useRecoilValue(authCurrentStep);
  const router = useRouter();

  const onClickLogo = () => {
    router.push('/');
  };
  const onClickLogout = () => {
    signOut(auth);
    alert('로그아웃되었습니다.');
  };
  return (
    <nav className="h-14 w-full flex justify-between px-10">
      <div onClick={onClickLogo} role="button" aria-hidden="true">
        <h1>동네마켓</h1>
      </div>
      {isLogin && currentStep === 0 && isLoginLoading && (
        <button type="button" onClick={onClickLogout}>
          로그아웃하기
        </button>
      )}
    </nav>
  );
}

export default Nav;
