import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { useRecoilValue } from 'recoil';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { auth, storage, db } from '../../firebase.config';
import { userInfo, authCurrentStep } from '../../recoil/state';

interface ImgFile {
  src: string;
  file?: File;
}

function PreviewImg({ src }: { src: string }) {
  return <img src={src} className="w-20" />;
}

function Write() {
  const { isLogin } = useRecoilValue(userInfo);
  const router = useRouter();

  const inputTitleRef = useRef<HTMLInputElement>(null);
  const inputContentRef = useRef<HTMLInputElement>(null);

  const redirectLoginPage = () => {
    alert('로그인 후 이용해주세요');
    router.push('/auth');
  };
  const initObj: ImgFile = {
    src: '',
    // file: new File([], ''),
  };
  const [beforeUploadImg, setBeforeUploadImg] = useState<Array<ImgFile>>([initObj]);
  const onChangeFileInput = (e: React.FormEvent<HTMLInputElement>) => {
    // console.log(e);
    // console.log(e.target.value);
    const file = (e.target as HTMLInputElement).files as FileList;
    const fileArr = Array.from(file);
    fileArr.forEach((f) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onloadend = (finishedEvent) => {
        const result = (finishedEvent.currentTarget as FileReader).result!.toString();
        const resultObj: ImgFile = {
          src: result,
          file: f,
        };
        setBeforeUploadImg((prevArray) => [...prevArray, resultObj]);
        console.log(result);
      };
    });
  };

  const onClickSubmitBtn = async () => {
    const title = inputTitleRef.current?.value as string;
    const content = inputContentRef.current?.value as string;
    beforeUploadImg.forEach((imgFile) => {
      const storageRef = ref(storage, `${imgFile.file.name}`);
      uploadBytes(storageRef, imgFile.file).then((snapshot) => {
        console.log(snapshot.ref.bucket);
      });
    });
    // await setDoc(doc(db, 'Post'), {
    //   title,
    //   content,
    //   images: [],
    // });
  };

  useEffect(() => {
    if (!isLogin) {
      router.prefetch('/auth');
      redirectLoginPage();
    }
  }, []);
  return (
    <div>
      <input type="text" placeholder="제목" ref={inputTitleRef} required />
      <input type="text" placeholder="내용" ref={inputContentRef} required />
      <input type="file" onChange={onChangeFileInput} multiple accept=".jpg, .jpeg, .png" />
      {beforeUploadImg.map((p) => (
        <PreviewImg key={p.src} src={p.src} />
      ))}
      <select placeholder="사용감" required>
        <option value="first">있음</option>
        <option value="second">적당함</option>
        <option value="third">거의 새것</option>
        <option value="fourth">미개봉</option>
      </select>
      <button type="button" onClick={onClickSubmitBtn}>
        제출하기
      </button>
    </div>
  );
}

export default Write;

// postId 설정 및 storage 경로로 지정해서 저장하기
// 사용감 항목 받아와서 submit에 변수 지정
// 작성자 id와 닉네임 recoil로 받아와서 저장
// 업로드 전 이미지 배열 순서 변경 및 삭제하기
