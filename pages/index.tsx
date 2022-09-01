import Link from 'next/link';

import { useRecoilValue } from 'recoil';
import { collection, getDocs } from 'firebase/firestore';
import { useState } from 'react';
import { userInfo } from '../recoil/state';
import { db } from '../firebase.config';

import { PostData } from '../types/post';
import Post from '../components/post';

function Home() {
  const { isLogin } = useRecoilValue(userInfo);
  const [postArr, setPostArr] = useState<PostData[]>();
  const getPostArr = async () => {
    const postDocsSnap = await getDocs(collection(db, 'Post'));
    const p = postDocsSnap.docs.map((doc) => doc.data()) as PostData[];
    setPostArr(p);
  };
  getPostArr();

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
      <ul>
        {postArr?.map((postData) => (
          <Post key={postData.postId} postData={postData} />
        ))}
      </ul>
    </div>
  );
}

export default Home;
