import { Dispatch, SetStateAction, useRef } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { PostData } from '../../types';

interface IChangeStatus {
  postData: PostData;
  setIsChangeStatus: Dispatch<SetStateAction<boolean>>;
  getData: () => void;
}

function ChangeStatus({ postData, setIsChangeStatus, getData }: IChangeStatus) {
  const selectStatusRef = useRef<HTMLSelectElement>(null);

  const onChangeStatusSelect = async () => {
    const status = selectStatusRef.current?.value as string;
    if (status === postData.status) {
      setIsChangeStatus(false);
    }
    await updateDoc(doc(db, 'Post', postData.postId), {
      status,
    }).then(() => {
      getData();
      setIsChangeStatus(false);
    });
  };
  return (
    <select ref={selectStatusRef} onChange={onChangeStatusSelect}>
      {postData.status === '판매중' ? (
        <>
          <option value="판매중">판매중</option>
          <option value="판매완료">판매완료</option>
        </>
      ) : (
        <>
          <option value="판매완료">판매완료</option>
          <option value="판매중">판매중</option>
        </>
      )}
    </select>
  );
}
export default ChangeStatus;
