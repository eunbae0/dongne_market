import Link from 'next/link';
import { useRouter } from 'next/router';

import { signOut } from 'firebase/auth';
import { useRecoilValue } from 'recoil';
import { auth } from '../../../firebase.config';

import { userInfo, authCurrentStep } from '../../recoil/state';

function Nav({ isLoginLoading }: { isLoginLoading: boolean }) {
  const { isLogin } = useRecoilValue(userInfo);
  const currentStep = useRecoilValue(authCurrentStep);
  const router = useRouter();

  const onClickLogo = () => {
    router.push('/');
  };
  const onClickLogout = () => {
    signOut(auth);
    alert('로그아웃되었습니다.');
    router.push('/');
  };
  return (
    <nav className="h-14 w-full flex justify-between items-center px-10">
      <div
        onClick={onClickLogo}
        className="text-2xl font-bold mr-auto"
        role="button"
        aria-hidden="true"
      >
        <h1>동네마켓</h1>
      </div>
      {isLogin && currentStep === 0 && isLoginLoading && (
        <Link href="/mypage">
          <a>
            <div className="rounded-full border-2 p-2 mr-6 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"
                  stroke="black"
                  strokeWidth=".01"
                />
              </svg>
            </div>
          </a>
        </Link>
      )}
      {isLogin ? (
        <button type="button" onClick={onClickLogout}>
          로그아웃
        </button>
      ) : (
        <Link href="/auth">
          <a>로그인</a>
        </Link>
      )}
    </nav>
  );
}

export default Nav;
