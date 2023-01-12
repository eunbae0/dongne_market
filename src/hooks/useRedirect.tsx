import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function useRedirect(isLogin: boolean) {
  const router = useRouter();
  useEffect(() => {
    if (!isLogin) {
      router.prefetch('/auth');
      alert('로그인 후 이용해주세요');
      router.push('/auth');
    }
  }, [isLogin, router]);
}
