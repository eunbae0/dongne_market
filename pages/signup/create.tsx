import { useRef, SetStateAction, useState } from 'react';

import { useSetRecoilState } from 'recoil';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { userId } from '../../recoil/state';
import { auth, db } from '../../firebase.config';

function Create({ setCurrentStep }: { setCurrentStep: React.Dispatch<SetStateAction<number>> }) {
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);
  const inputNicknameRef = useRef<HTMLInputElement>(null);

  // firestore에서 중복확인 및 거르기
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [nicknameErrorMsg, setNicknameErrorMsg] = useState('');
  const onChangeEmailInput = async () => {
    const email = inputEmailRef.current?.value as string;
    const findEmailQ = query(collection(db, 'User'), where('email', '==', email));
    const querySnapshot = await getDocs(findEmailQ);
    if (!querySnapshot.empty) {
      setEmailErrorMsg('사용중인 이메일입니다.');
    } else if (email.length === 0) {
      setEmailErrorMsg('');
    } else {
      setEmailErrorMsg('사용가능한 이메일입니다.');
    }
  };
  const onChangeNicknameInput = async () => {
    const nickname = inputNicknameRef.current?.value as string;
    const findNicknameQ = query(collection(db, 'User'), where('nickname', '==', nickname));

    const querySnapshot = await getDocs(findNicknameQ);
    if (!querySnapshot.empty) {
      setNicknameErrorMsg('사용중인 닉네임입니다.');
    } else if (nickname.length === 0) {
      setEmailErrorMsg('');
    } else {
      setNicknameErrorMsg('사용가능한 닉네임입니다.');
    }
  };

  // 비밀번호 검증 및 중복확인
  const [isSuccessDCheck, setIsSuccessDCheck] = useState(false);
  const onChangePassword = () => {
    setIsSuccessDCheck(false);
  };
  const onClickDCheck = () => {
    const password = inputPasswordRef.current?.value as string;
    const reg = '^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)-_=+]).{8,16}$';
    const re = new RegExp(reg);
    console.log(password);
    if (!re.test(password)) {
      alert('8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 조합으로 작성해주세요');
      setIsSuccessDCheck(false);
    } else {
      alert('중복확인 되었습니다');
      setIsSuccessDCheck(true);
    }
  };

  // 로그인 폼 제출
  const setUserId = useSetRecoilState(userId);
  const onSubmitLoginForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = inputEmailRef.current?.value as string;
    const password = inputPasswordRef.current?.value as string;
    const nickname = inputNicknameRef.current?.value as string;
    if (emailErrorMsg === '사용중인 이메일입니다.') {
      alert('이메일을 확인해주세요');
      return;
    }
    if (nicknameErrorMsg === '사용중인 닉네임입니다.') {
      alert('닉네임을 확인해주세요');
      return;
    }
    if (!isSuccessDCheck) {
      alert('비밀번호 중복확인을 해주세요');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        try {
          const { uid } = userCredential.user;
          // nickName, email, uid정보 저장
          await setDoc(doc(db, 'User', uid), {
            uid,
            email,
            nickname,
          });
          setUserId(uid);
          setCurrentStep(1);
        } catch (error) {
          console.error(error);
        }
      })
      .catch((err) => {
        console.log(err.code, err.message);
      });
  };
  return (
    <>
      <h2 className="font-bold text-4xl">Sign Up</h2>
      <h3 className="font-xl text-gray-500">Welcome! please enter your details.</h3>
      <form onSubmit={onSubmitLoginForm}>
        <span className={`${emailErrorMsg === '사용중인 이메일입니다.' ? 'text-red-500' : ''}`}>
          {emailErrorMsg}
        </span>
        <input
          className={`authInput ${
            emailErrorMsg === '사용중인 이메일입니다.' ? '!border-red-500' : ''
          }`}
          onChange={onChangeEmailInput}
          type="email"
          name="email"
          placeholder="email"
          ref={inputEmailRef}
          required
        />
        <input
          className="authInput"
          onChange={onChangePassword}
          type="password"
          placeholder="password"
          ref={inputPasswordRef}
          required
        />
        <button className="" type="button" onClick={onClickDCheck}>
          중복확인
        </button>
        <span className={`${nicknameErrorMsg === '사용중인 닉네임입니다.' ? 'text-red-500' : ''}`}>
          {nicknameErrorMsg}
        </span>
        <input
          className={`authInput ${
            nicknameErrorMsg === '사용중인 닉네임입니다.' ? '!border-red-500' : ''
          }`}
          onChange={onChangeNicknameInput}
          type="text"
          name="nickname"
          placeholder="닉네임"
          ref={inputNicknameRef}
          required
        />
        <button className="authBtn" type="submit">
          가입하기
        </button>
      </form>
      <button onClick={() => setCurrentStep(1)} type="button">
        임시
      </button>
    </>
  );
}

export default Create;
