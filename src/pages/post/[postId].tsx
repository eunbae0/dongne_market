import { useRouter } from 'next/router';
import { getDoc, deleteDoc, doc } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { db } from '../../../firebase.config';
import { userInfo } from '../../recoil/state';
import { PostData } from '../../types';
import ShowMore from '../../components/common/showMore';
import ChangeStatus from '../../components/post/changeStatus';

function Post() {
  const router = useRouter();
  const postId = router.query.postId as string;
  const { uid } = useRecoilValue(userInfo);

  const redirectHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const [isGetPostData, setIsGetPostData] = useState(true);
  const [postData, setPostData] = useState<PostData>();
  const getPostData = async () => {
    const postDocSnap = await getDoc(doc(db, 'Post', postId));
    if (postDocSnap.exists()) {
      const data = postDocSnap.data() as PostData;
      const getNickname = await getDoc(doc(db, 'User', data.author_id));
      const nickname = getNickname.data()?.nickname as string;
      const postDataObj = {
        ...data,
        nickname,
      };
      setPostData(postDataObj);
      setIsGetPostData(false);
    } else {
      setIsGetPostData(false);
      redirectHome();
    }
  };
  useMemo(() => {
    console.log('render');
    getPostData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertTimeStamp = (time: number) => {
    const date = new Date(time);
    const addZero = (t: number) => {
      if (t < 10) {
        return `0${t}`;
      }
      return t;
    };
    const fullDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${addZero(
      date.getHours()
    )}:${addZero(date.getMinutes())}`;
    return fullDate;
  };

  // 수정 토글
  const [isClickChange, setIsClickChange] = useState(false);
  // 판매중-판매완료 상태 변경
  const [isChangeStatus, setIsChangeStatus] = useState(false);
  const onClickStatusChangeBtn = () => {
    setIsChangeStatus(true);
    setIsClickChange(false);
  };

  // 게시글 삭제
  const onClickPostDeleteBtn = async () => {
    const ok = window.confirm('게시글을 삭제하시겠습니까?');
    if (ok) {
      await deleteDoc(doc(db, 'Post', postData!.postId)).then(() => {
        alert('삭제되었습니다');
        router.push('/');
      });
    }
  };
  const onClickChatBtn = () => {};

  useEffect(() => {
    if (isGetPostData) {
      if (postData && postId) {
        alert('해당게시글이 존재하지 않습니다.');
        redirectHome();
      }
    }
  }, [isGetPostData, postData, postId, redirectHome]);
  return (
    <div className="h-full w-7/12 mx-auto my-0">
      {!isGetPostData ? (
        postData && postId ? (
          <>
            <div className="relative mt-24 flex justify-between items-center">
              <h2 className="font-bold text-4xl">{postData.title}</h2>
              {uid === postData.author_id && <ShowMore setIsClickChange={setIsClickChange} />}
              {isClickChange && (
                <div className="absolute top-10 right-0 flex flex-col justify-center bg-purple-100 rounded-md">
                  <button
                    className="px-2 py-1 text-sm"
                    type="button"
                    onClick={onClickStatusChangeBtn}
                  >
                    상태변경하기
                  </button>
                  <button
                    className="px-2 py-1 text-sm"
                    type="button"
                    onClick={onClickPostDeleteBtn}
                  >
                    게시글 삭제
                  </button>
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-between items-center w-full">
              <div>
                <span>{postData.nickname}</span>
                <span className="px-2">|</span>
                <span>{convertTimeStamp(postData.timeStamp)}</span>
              </div>
              {isChangeStatus ? (
                <ChangeStatus
                  postData={postData}
                  setIsChangeStatus={setIsChangeStatus}
                  getData={getPostData}
                />
              ) : (
                <div className="statusBox">{postData.status}</div>
              )}
            </div>
            {postData.images &&
              postData.images.map((src: string) => (
                <div key={src} className="w-full my-8">
                  <Image src={src} alt={src} width="500px" height="500px" />
                </div>
              ))}
            <h3 className="font-bold text-2xl">{postData.price}</h3>
            <span className="inline-block tracking-wider my-6">{postData.content}</span>
            <div>{postData.usage}</div>
            <button className="chatBtn" type="button" onClick={onClickChatBtn}>
              채팅하기
            </button>
          </>
        ) : (
          <>해당 게시글이 존재하지 않습니다.</>
        )
      ) : (
        <>로딩중</>
      )}
    </div>
  );
}

export default Post;

// time 작성일(년원일시)변경
// 닉네임 불러오기
