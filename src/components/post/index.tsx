/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { PostData } from '../../types';
import noImg from '../../styles/noImage.png';
import arrowCircle from '../../styles/arrowCircle.png';

import ChangeStatus from './changeStatus';

interface Ipost {
  postData: PostData;
  isMyPage?: boolean;
  getData: () => void;
}

function Post({ postData, isMyPage, getData }: Ipost) {
  const router = useRouter();
  const onClickPost = () => {
    router.push(`/post/${postData.postId}`);
  };

  // 상태 변경 로직
  const [isChangeStatus, setIsChangeStatus] = useState(false);
  const onClickChangeStatusBtn = () => {
    setIsChangeStatus(true);
  };
  return (
    <li className="pt-1">
      <div
        onClick={onClickPost}
        className="bg-white rounded-2xl cursor-pointer"
        role="button"
        tabIndex={0}
      >
        <div className="relative m-3">
          <div className="relative h-[170px]">
            <Image
              src={postData.images && postData.images?.length !== 0 ? postData.images[0] : noImg}
              alt=""
              layout="fill"
              className="rounded-2xl"
            />
          </div>
        </div>
        <div className="flex px-5 pt-1 pb-4 items-end">
          <div>{postData.title}</div>
          <div>{postData.price}</div>
        </div>
      </div>
      {isMyPage && (
        <div className="flex justify-between px-3 py-4 hover:bg-purple-100 rounded-b-2xl">
          {isChangeStatus ? (
            <ChangeStatus
              postData={postData}
              setIsChangeStatus={setIsChangeStatus}
              getData={getData}
            />
          ) : (
            <div className="statusBox">{postData.status}</div>
          )}
          <button onClick={onClickChangeStatusBtn} type="button">
            <Image src={arrowCircle} alt="" width="20px" height="20px" />
          </button>
        </div>
      )}
    </li>
  );
}
export default Post;
