import { useRef, SetStateAction } from 'react';

import { doc, updateDoc } from 'firebase/firestore';
import { useRecoilValue } from 'recoil';
import { db } from '../../firebase.config';
import { userId } from '../../recoil/state';

function SetInfo({ setCurrentStep }: { setCurrentStep: React.Dispatch<SetStateAction<number>> }) {
  const inputIntroRef = useRef<HTMLInputElement>(null);
  const inputNeightborRef = useRef<HTMLInputElement>(null);
  const uid = useRecoilValue(userId);

  const onSubmitInfoForm = async () => {
    const introduction = inputIntroRef.current?.value as string;
    const neightborhood = inputNeightborRef.current?.value as string;
    // if (introduction === '' || neightborhood === '') {
    //   alert('정보를 모두 입력해주세요');
    //   return;
    //   // 이문 발생시 새로고침 일어나 usestate값 초기화됨. 상태관리 라이브러리 사용하기.
    // }
    await updateDoc(doc(db, 'User', uid), {
      introduction,
      neightborhood,
    }).then(async () => {
      await setCurrentStep(2);
    });
  };

  const onClickLaterBtn = () => {
    setCurrentStep(2);
  };
  return (
    <div>
      <form onSubmit={onSubmitInfoForm}>
        <input
          className="authInput"
          type="text"
          placeholder="소개글을 작성해주세요"
          ref={inputIntroRef}
          required
        />
        <input
          className="authInput"
          type="text"
          placeholder="동네를 설정해주세요"
          ref={inputNeightborRef}
          required
        />
        <button className="authBtn" type="submit">
          작성 완료
        </button>
      </form>
      <button className="mx-1 text-purple-700" onClick={onClickLaterBtn} type="button">
        나중에 하기
      </button>
      <button onClick={() => setCurrentStep(2)} type="button">
        임시
      </button>
    </div>
  );
}

export default SetInfo;
