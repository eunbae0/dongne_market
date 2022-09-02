/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useRouter } from 'next/router';
import Image from 'next/image';
import { PostData } from '../../types/post';
import noImg from '../../styles/noImage.png';

function Post({ postData }: { postData: PostData }) {
  const router = useRouter();
  const onClickPost = () => {
    router.push(`/post/${postData.postId}`);
  };
  return (
    <li onClick={onClickPost} className="bg-white rounded-2xl pt-1 cursor-pointer">
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
    </li>
  );
}
export default Post;
