import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useRecoilValue } from 'recoil';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { userInfo } from '../../recoil/state';

import { auth } from '../../../firebase.config';

function Auth() {
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);
  const { isLogin } = useRecoilValue(userInfo);
  const router = useRouter();

  const onSubmitLoginForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = inputEmailRef.current?.value as string;
    const password = inputPasswordRef.current?.value as string;
    if (email === '' || password === '') {
      alert('로그인 정보를 모두 입력해주세요');
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push('/');
      })
      .catch((err) => {
        if (err.code === 'auth/user-not-found') {
          alert('이메일을 확인해주세요');
          return;
        }
        if (err.code === 'auth/wrong-password') {
          alert('비밀번호를 확인해주세요');
          return;
        }
        console.log(err.code, '+', err.message);
      });
  };

  useEffect(() => {
    router.prefetch('/');
    if (isLogin) {
      alert('이미 로그인 되어있습니다.');
      router.push('/');
    }
  }, [isLogin, router]);

  return (
    <div className="h-full">
      <div className="h-full w-9/12 mx-auto my-0">
        <div className="h-3/5 w-full bg-slate-200 mt-32 flex justify-center items-center">
          <div className="w-80 h-4/5 flex flex-col justify-between">
            <h2 className="font-bold text-4xl">Welcome back</h2>
            <h3 className="font-xl text-gray-500">Welcome back! please enter your details.</h3>
            <form onSubmit={onSubmitLoginForm} className="flex flex-col">
              <input
                className="authInput"
                type="email"
                placeholder="Enter your email"
                ref={inputEmailRef}
              />
              <input
                className="authInput"
                type="password"
                placeholder="password"
                ref={inputPasswordRef}
              />
              <button className="authBtn" type="submit">
                로그인하기
              </button>
            </form>
            <div className="text-center">
              <span>계정이 없으신가요?</span>
              <Link href="/signup">
                <a className="mx-1 text-purple-700">회원가입</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
