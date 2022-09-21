import Link from 'next/link';
import Image from 'next/image';

import { collection, getDocs, where, query } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { db } from '../firebase.config';

import { PostData } from '../types';
import Post from '../components/post';

import Write from '../styles/write.png';

function Home() {
  const [isClickStatusBtn, setIsClickStatusBtn] = useState(false);
  const [postArr, setPostArr] = useState<PostData[]>();
  const getPostArr = async (b: boolean) => {
    if (!b) {
      const postDocsSnap = await getDocs(collection(db, 'Post'));
      const p = postDocsSnap.docs.map((doc) => doc.data()) as PostData[];
      setPostArr(p);
    } else {
      const postDocsSnap = await getDocs(
        query(collection(db, 'Post'), where('status', '==', '판매중'))
      );
      const p = postDocsSnap.docs.map((doc) => doc.data()) as PostData[];
      setPostArr(p);
    }
  };
  useMemo(() => {
    getPostArr(isClickStatusBtn);
  }, [isClickStatusBtn]);

  return (
    <div className="h-screen relative">
      <div className="w-6/12 mx-auto my-0">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold mr-auto">중고거래</h2>
          <span className="text-xl font-bold">판매중만 보기</span>
          <button
            type="button"
            className="relative p-4"
            onClick={() => setIsClickStatusBtn((prev) => !prev)}
          >
            <div
              className={`pointer-events-auto h-6 w-10 rounded-full p-1 ring-1 ring-inset transition duration-200 ease-in-out ${
                isClickStatusBtn
                  ? 'bg-indigo-600 ring-black/20'
                  : 'bg-slate-900/10 ring-slate-900/5'
              } `}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 transition duration-200 ease-in-out ${
                  isClickStatusBtn ? 'translate-x-4' : ''
                }`}
              />
            </div>
          </button>
        </div>
        <div>
          <ul className="grid grid-cols-3 gap-x-6 gap-y-6 mt-8">
            {postArr?.map((postData) => (
              <Post key={postData.postId} postData={postData} />
            ))}
          </ul>
        </div>
      </div>
      <button type="button" className="fixed right-24 bottom-16 p-2 rounded-full bg-white border-1">
        <Link href="/write">
          <a>
            <Image className="object-none" src={Write} alt="" width="32px" height="32px" />
          </a>
        </Link>
      </button>
    </div>
  );
}

export default Home;
