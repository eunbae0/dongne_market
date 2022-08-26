import { SetStateAction } from 'react';
import { useRouter } from 'next/router';

function Welcome({ setCurrentStep }: { setCurrentStep: React.Dispatch<SetStateAction<number>> }) {
  const router = useRouter();
  const onClickGoLogin = () => {
    setCurrentStep(0);
    router.push('/');
  };
  return (
    <div>
      <h2 className="font-bold text-4xl">Welcome</h2>
      <button onClick={onClickGoLogin} type="button">
        서비스 이용하기
      </button>
    </div>
  );
}

export default Welcome;
