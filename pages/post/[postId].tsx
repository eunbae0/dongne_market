import { useRouter } from 'next/router';
import { getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { db } from '../../firebase.config';
import { userInfo } from '../../recoil/state';

interface PostData {
  postId: string;
  author_id: string;
  title: string;
  content: string;
  usage: string;
  timeStamp: number;
  nickname: string;
  status: string;
  images?: string[];
}
function Post() {
  const router = useRouter();
  const postId = router.query.postId as string;
  const { uid } = useRecoilValue(userInfo);

  const redirectHome = () => {
    router.push('/');
  };

  const [isGetPostData, setIsGetPostData] = useState(true);
  const [postData, setPostData] = useState<PostData>();
  const getPostData = async () => {
    const postDocSnap = await getDoc(doc(db, 'Post', postId));
    if (postDocSnap.exists()) {
      const data = postDocSnap.data();
      const getNickname = await getDoc(doc(db, 'User', data.author_id));
      const nickname = getNickname.data()?.nickname as string;
      const postDataObj: PostData = {
        ...data,
        nickname,
      };
      // console.log(postDataObj);
      setPostData(postDataObj);
      setIsGetPostData(false);
    } else {
      setIsGetPostData(false);
      redirectHome();
    }
  };
  getPostData();
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
  // 판매중-판매완료 상태 변경
  const selectStatusRef = useRef<HTMLSelectElement>(null);
  const [isChangeStatus, setIsChangeStatus] = useState(false);
  const onChangeStatusSelect = async () => {
    const status = selectStatusRef.current?.value as string;
    await updateDoc(doc(db, 'Post', postData!.postId), {
      status,
    }).then(() => {
      setIsChangeStatus(false);
    });
  };
  const onClickStatusChangeBtn = () => {
    setIsChangeStatus(true);
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
    <div>
      {!isGetPostData ? (
        postData && postId ? (
          <>
            <div>{postData.title}</div>
            <div>{postData.content}</div>
            <div>{postData.nickname}</div>
            <div>{convertTimeStamp(postData.timeStamp)}</div>
            {postData.images &&
              postData.images.map((src: string) => (
                <Image key={src} src={src} alt={src} width="100px" height="100px" />
              ))}
            <div>{postData.usage}</div>
            {isChangeStatus ? (
              <select ref={selectStatusRef} onChange={onChangeStatusSelect}>
                <option value="판매중">판매중</option>
                <option value="판매완료">판매완료</option>
              </select>
            ) : (
              <div>{postData.status}</div>
            )}
            {uid === postData.author_id && (
              <>
                <button type="button" onClick={onClickStatusChangeBtn}>
                  상태변경하기
                </button>
                <button type="button" onClick={onClickPostDeleteBtn}>
                  게시글 삭제
                </button>
              </>
            )}
            <button type="button" onClick={onClickChatBtn}>
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
