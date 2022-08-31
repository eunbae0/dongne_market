import { useRouter } from 'next/router';
import { getDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import Image from 'next/image';
import { db } from '../../firebase.config';

interface PostData {
  postId: string;
  author_id: string;
  title: string;
  content: string;
  images?: string[];
  usage: string;
  timeStamp: number;
  nickname?: string;
  status: string;
}
function Post() {
  const router = useRouter();
  const postId = router.query.postId as string;

  const redirectHome = () => {
    router.push('/');
  };

  const [postData, setPostData] = useState<PostData>();
  const getPostData = async () => {
    const postDocSnap = await getDoc(doc(db, 'Post', postId));
    // .then(async (data) => {
    // const getNickname = await getDoc(doc(db, 'User', data.data()?.author_id));
    // const nickname = getNickname.data()?.nickname as string;
    // setPostData((prev) => ({ ...prev, nickname }));
    // });
    if (postDocSnap.exists()) {
      const data = postDocSnap.data() as PostData;
      setPostData(data);
    } else {
      alert('해당 게시글이 존재하지 않습니다.');
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

  const onClickStatusChangeBtn = () => {};
  const onClickPostDeleteBtn = () => {};
  const onClickChatBtn = () => {};

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {postData && postId ? (
        <div>
          <div>{postData.title}</div>
          <div>{postData.content}</div>
          <div>{convertTimeStamp(postData.timeStamp)}</div>
          {postData.images &&
            postData.images.map((src: string) => (
              <Image key={src} src={src} alt={src} width="100px" height="100px" />
            ))}
          <div>{postData.usage}</div>
          <div>{postData.status}</div>
          <button type="button" onClick={onClickStatusChangeBtn}>
            상태변경
          </button>
          <button type="button" onClick={onClickPostDeleteBtn}>
            게시글 삭제
          </button>
          <button type="button" onClick={onClickChatBtn}>
            채팅하기
          </button>
        </div>
      ) : (
        redirectHome
      )}
    </>
  );
}

export default Post;

// time 작성일(년원일시)변경
// 닉네임 불러오기
