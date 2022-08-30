import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuid } from 'uuid';

import { useRecoilValue } from 'recoil';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';
import { storage, db } from '../../firebase.config';
import { userInfo } from '../../recoil/state';

import useRedirect from '../../hooks/useRedirect';

interface ImgFile {
  src: string;
  file: File;
}

function PreviewImg({ src, deleteImgObj }: { src: string; deleteImgObj: (src: string) => void }) {
  return (
    <>
      <Image src={src} alt={src} width="20px" height="20px" className="w-20" />
      <button type="button" onClick={() => deleteImgObj(src)}>
        X
      </button>
    </>
  );
}

function Write() {
  const router = useRouter();
  const { isLogin, uid } = useRecoilValue(userInfo);

  const inputTitleRef = useRef<HTMLInputElement>(null);
  const inputContentRef = useRef<HTMLInputElement>(null);
  const selectUsageRef = useRef<HTMLSelectElement>(null);

  // 이미지파일 관리
  const [beforeUploadImgObj, setBeforeUploadImgObj] = useState<Array<ImgFile>>([]);
  const onChangeFileInput = (e: React.FormEvent<HTMLInputElement>) => {
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
        setBeforeUploadImgObj((prevArray) => [...prevArray, resultObj]);
      };
    });
  };
  const deleteImgObj = (src: string) => {
    setBeforeUploadImgObj(beforeUploadImgObj.filter((user) => user.src !== src));
  };

  // 제출하기
  const onClickSubmitBtn = (e: React.FormEvent<HTMLButtonElement>) => {
    const title = inputTitleRef.current?.value as string;
    const content = inputContentRef.current?.value as string;
    const usage = selectUsageRef.current?.value as string;
    const postId = uuid();

    const imgUrlArr: string[] = [];
    beforeUploadImgObj.forEach((imgFile) => {
      const storageRef = ref(storage, `postImage/${uid}/${postId}/${imgFile.file.name}`);
      uploadBytes(storageRef, imgFile.file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          // setImgUrlArr((prev) => [...prev, url]);
          imgUrlArr.push(url);
          if (imgUrlArr.length === beforeUploadImgObj.length) {
            setDoc(doc(db, 'Post', postId), {
              postId,
              author_id: uid,
              title,
              content,
              images: imgUrlArr,
              usage,
              timeStamp: e.timeStamp,
            }).then(() => {
              alert('작성이 완료되었습니다.');
              router.push('/');
            });
          }
        });
      });
    });
  };
  useRedirect(isLogin);
  return (
    <div>
      <input type="text" placeholder="제목" ref={inputTitleRef} required />
      <input type="text" placeholder="내용" ref={inputContentRef} required />
      <input type="file" onChange={onChangeFileInput} multiple accept=".jpg, .jpeg, .png" />
      {beforeUploadImgObj.map((p) => (
        <PreviewImg key={p.src} src={p.src} deleteImgObj={deleteImgObj} />
      ))}
      <select ref={selectUsageRef} placeholder="사용감" required>
        <option value="있음">있음</option>
        <option value="적당함">적당함</option>
        <option value="거의 새것">거의 새것</option>
        <option value="미개봉">미개봉</option>
      </select>
      <button type="button" onClick={onClickSubmitBtn}>
        제출하기
      </button>
    </div>
  );
}

export default Write;

// postId 설정 및 storage 경로로 지정해서 저장하기
// 닉네임은 postid에 추가 x. 나중에 받아올때 user에서 찾아서 세팅.
// 사용감 항목 받아와서 submit에 변수 지정
// 작성자 id와 닉네임 recoil로 받아와서 저장
// 업로드 전 이미지 배열 순서 변경 및 삭제하기
