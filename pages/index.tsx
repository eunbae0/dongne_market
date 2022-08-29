import Link from 'next/link';

import { onAuthStateChanged } from 'firebase/auth';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { auth } from '../firebase.config';
import { userInfo } from '../recoil/state';

function Home() {
  // 이 파일은 경로 / 인 파일이므로 isLogin정보는 _app단에서 할것 - 글쓰기
  const { isLogin } = useRecoilValue(userInfo);
  return (
    <div className="h-screen">
      {isLogin ? (
        <Link href="/mypage">
          <a>마이페이지</a>
        </Link>
      ) : (
        <Link href="/auth">
          <a>로그인하러가기</a>
        </Link>
      )}
      <Link href="/write">
        <a>글쓰기(임시)</a>
      </Link>
    </div>
  );
}

export default Home;
