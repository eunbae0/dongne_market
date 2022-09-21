import { useMemo, useRef, useState, Dispatch, SetStateAction } from 'react';
import { getDoc, doc, getDocs, collection, where, query, deleteDoc } from 'firebase/firestore';
import { deleteUser, reauthenticateWithCredential, User, EmailAuthProvider } from 'firebase/auth';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { db, auth } from '../../firebase.config';
import { userInfo } from '../../recoil/state';
import { PostData, UserData } from '../../types';

import Post from '../../components/post';
import Modal from '../../components/common/modal';

async function userRecertification(email: string, password: string) {
  const user = auth.currentUser as User;
  const authCredential = EmailAuthProvider.credential(email, password);
  let bool;
  await reauthenticateWithCredential(user, authCredential)
    .then(() => {
      // User re-authenticated.
      console.log('success');
      bool = true;
    })
    .catch((error) => {
      console.log(error);
      bool = false;
    });
  return bool;
}

function ChangeUserInfo({
  email,
  setIsClickSetUserInfo,
  setIsCompleteRecertification,
}: {
  email: string;
  setIsClickSetUserInfo: Dispatch<SetStateAction<boolean>>;
  setIsCompleteRecertification: Dispatch<SetStateAction<boolean>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onsubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = inputRef.current?.value as string;
    const status = await userRecertification(email, password);
    console.log(status);
    if (status) {
      setIsClickSetUserInfo(false);
      setIsCompleteRecertification(true);
    }
  };
  return (
    <div className="bg-white w-8/12 h-8/12 flex flex-col items-center">
      <span>회원 계정 정보 변경을 위해 비밀번호를 다시 입력해주세요</span>
      <form onSubmit={onsubmitForm}>
        <input type="password" placeholder="password" ref={inputRef} />
      </form>
      <div />
    </div>
  );
}

function MyPage() {
  const { uid, email } = useRecoilValue(userInfo);

  const [userData, setUserData] = useState<UserData>();
  const getUserData = async () => {
    const getUserDataDoc = await getDoc(doc(db, 'User', uid));
    const userDataObj = getUserDataDoc.data() as UserData;
    setUserData(userDataObj);
  };
  const [postArr, setPostArr] = useState<PostData[]>();
  const getPostArr = async () => {
    const postDocsSnap = await getDocs(
      query(collection(db, 'Post'), where('author_id', '==', uid))
    );
    const p = postDocsSnap.docs.map((docs) => docs.data()) as PostData[];
    setPostArr(p);
  };
  useMemo(() => {
    console.log('render');
    getUserData();
    getPostArr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isClickSetUserInfo, setIsClickSetUserInfo] = useState(false);
  const [isCompleteRecertification, setIsCompleteRecertification] = useState(false);
  // 회원 탈퇴
  const router = useRouter();
  const onClickWithdrawalBtn = () => {
    if (!isCompleteRecertification) {
      setIsClickSetUserInfo(true);
    } else {
      const user = auth.currentUser as User;
      const ok = window.confirm(
        '정말로 탈퇴를 진행하시겠습니까? 작성 게시글과 유저 정보가 모두 삭제됩니다.'
      );
      if (ok) {
        deleteUser(user)
          .then(async () => {
            await deleteDoc(doc(db, 'User', uid));
            postArr?.map(async (postData) => deleteDoc(doc(db, 'Post', postData.postId)));
            alert('탈퇴가 완료되었습니다');
            router.push('/');
          })
          .catch((err) => {
            console.log('에러발생:', err);
          });
      }
    }
  };
  return (
    <div>
      {isClickSetUserInfo && (
        <Modal setStatus={setIsClickSetUserInfo}>
          <ChangeUserInfo
            email={email}
            setIsClickSetUserInfo={setIsClickSetUserInfo}
            setIsCompleteRecertification={setIsCompleteRecertification}
          />
        </Modal>
      )}
      <div className="w-6/12 mx-auto my-10">
        <div className="py-12 bg-white rounded-lg">
          <div className="flex flex-col items-center">
            <div className="rounded-full w-28 h-28 bg-slate-700" />
            <div>{userData?.nickname}</div>
            <div className="flex flex-col items-start w-11/12">
              <h3 className="my-2">소개글</h3>
              {userData?.introduction ? (
                <div>{userData?.introduction}</div>
              ) : (
                '소개글이 작성되지 않았습니다'
              )}
              <h3>동네 정보</h3>
              {userData?.neightborhood ? (
                <div>{userData?.neightborhood}</div>
              ) : (
                '동네정보가 없습니다'
              )}
            </div>
            <button onClick={onClickWithdrawalBtn} type="button">
              탈퇴하기
            </button>
          </div>
        </div>
        <ul className="grid grid-cols-3 gap-x-6 gap-y-6 mt-8">
          {postArr
            ? postArr.map((postData) => <Post key={postData.postId} postData={postData} />)
            : '작성된 게시글이 없습니다'}
        </ul>
      </div>
    </div>
  );
}

export default MyPage;
