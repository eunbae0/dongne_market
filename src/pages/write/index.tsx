import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuid } from 'uuid';

import { useRecoilValue } from 'recoil';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';
import { storage, db } from '../../../firebase.config';
import { userInfo } from '../../recoil/state';

import useRedirect from '../../hooks/useRedirect';

interface ImgFile {
  src: string;
  file: File;
}

function PreviewImg({ src, deleteImgObj }: { src: string; deleteImgObj: (src: string) => void }) {
  return (
    <>
      <Image src={src} alt={src} width="100px" height="100px" className="w-20 object-cover" />
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
  const inputContentRef = useRef<HTMLTextAreaElement>(null);
  const inputPriceRef = useRef<HTMLInputElement>(null);
  const selectUsageRef = useRef<HTMLSelectElement>(null);

  const MAX_IMAGE_UPLOAD = 10;
  // 이미지파일 관리
  const [beforeUploadImgObj, setBeforeUploadImgObj] = useState<Array<ImgFile>>([]);
  const onChangeFileInput = (e: React.FormEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement).files as FileList;

    if (beforeUploadImgObj.length + file.length > MAX_IMAGE_UPLOAD) {
      alert('최대 10장까지 업로드 가능합니다.');
      return;
    }

    const fileArr = Array.from(file);
    fileArr.forEach((f) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onloadend = (finishedEvent) => {
        const result = (finishedEvent.currentTarget as FileReader).result!.toString();
        if (beforeUploadImgObj.find((i) => i.src === result)) {
          alert('중복된 이미지입니다.');
          return;
        }
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
  const onSubmitWrite = () => {
    const title = inputTitleRef.current?.value as string;
    const content = inputContentRef.current?.value as string;
    const price = inputPriceRef.current?.value as string;
    const usage = selectUsageRef.current?.value as string;
    const postId = uuid();
    const addComma = (p: string) => {
      return p.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const imgUrlArr: string[] = [];
    if (beforeUploadImgObj.length !== 0) {
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
                price: addComma(price),
                images: imgUrlArr,
                usage,
                timeStamp: Date.now(),
                status: '판매중',
              }).then(() => {
                alert('작성이 완료되었습니다.');
                router.push('/');
              });
            }
          });
        });
      });
    } else {
      setDoc(doc(db, 'Post', postId), {
        postId,
        author_id: uid,
        title,
        content,
        price: addComma(price),
        images: [],
        usage,
        timeStamp: Date.now(),
        status: '판매중',
      }).then(() => {
        alert('작성이 완료되었습니다.');
        router.push('/');
      });
    }
  };
  useRedirect(isLogin);
  return (
    <div className="w-9/12 mx-auto my-0 mt-10 bg-white rounded-md">
      <form className="w-1/2 mx-auto my-0 py-6 flex flex-col items-center" onSubmit={onSubmitWrite}>
        <input
          className="w-full p-4 outline-none border-b text-xl"
          type="text"
          placeholder="제목"
          ref={inputTitleRef}
          required
        />
        <textarea
          className="w-full mt-4 p-4 outline-none border-b text-lg resize-none"
          placeholder="내용"
          ref={inputContentRef}
          required
        />
        <input
          className="w-full mt-4 p-4 outline-none border-b text-xl"
          type="number"
          placeholder="가격"
          ref={inputPriceRef}
          required
        />
        <input
          id="writeImgInput"
          className="hidden"
          type="file"
          onChange={onChangeFileInput}
          multiple
          accept=".jpg, .jpeg, .png"
        />
        <div className="flex justify-start w-full">
          <label
            className="w-[100px] h-[100px] flex flex-col justify-center items-center cursor-pointer"
            htmlFor="writeImgInput"
          >
            <svg
              className="h-[24px] w-[24px]"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              data-testid="CameraAltIcon"
              aria-label="fontSize large"
            >
              <circle cx="12" cy="12" r="3.2" />
              <path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
            </svg>
            <span>
              {beforeUploadImgObj.length}/{MAX_IMAGE_UPLOAD}
            </span>
          </label>
          <div className="flex flex-1 flex-shrink-0">
            {beforeUploadImgObj.map((p) => (
              <PreviewImg key={p.src} src={p.src} deleteImgObj={deleteImgObj} />
            ))}
          </div>
        </div>
        <div className="w-full flex justify-between mt-8 items-center">
          <h3 className="font-bold text-xl">사용감</h3>
          <select className="p-3 outline-none" ref={selectUsageRef} placeholder="사용감" required>
            <option value="있음">있음</option>
            <option value="적당함">적당함</option>
            <option value="거의 새것">거의 새것</option>
            <option value="미개봉">미개봉</option>
          </select>
        </div>
        <button className="chatBtn" type="submit">
          제출하기
        </button>
      </form>
    </div>
  );
}

export default Write;

// postId 설정 및 storage 경로로 지정해서 저장하기
// 닉네임은 postid에 추가 x. 나중에 받아올때 user에서 찾아서 세팅.
// 사용감 항목 받아와서 submit에 변수 지정
// 작성자 id와 닉네임 recoil로 받아와서 저장
// 업로드 전 이미지 배열 순서 변경 및 삭제하기

// 이미지 드래그 순서변경로직
