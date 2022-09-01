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
    <li onClick={onClickPost}>
      <Image
        src={postData.images && postData.images?.length !== 0 ? postData.images[0] : noImg}
        alt=""
        width="100px"
        height="100px"
      />
      <div>{postData.title}</div>
      <div>{postData.price}</div>
    </li>
  );
}
export default Post;
