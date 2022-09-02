import { useRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authCurrentStep, userInfo } from '../../recoil/state';

import ProgressBar from './progressBar';
import Create from './create';
import SetInfo from './setInfo';
import Welcome from './welcome';

function SignUp() {
  const { isLogin } = useRecoilValue(userInfo);
  const router = useRouter();
  // const beforeUnloadListener = (event) => {
  //   event.preventDefault();
  //   return (event.returnValue = 'Are you sure you want to exit?');
  // };

  // useEffect(() => {
  //   window.addEventListener('beforeunload', beforeUnloadListener);
  // }, []);

  const [currentStep, setCurrentStep] = useRecoilState(authCurrentStep);
  const switchSignUpStep = (cur: number) => {
    switch (cur) {
      case 0:
        return <Create setCurrentStep={setCurrentStep} />;
      case 1:
        return <SetInfo setCurrentStep={setCurrentStep} />;
      case 2:
        return <Welcome setCurrentStep={setCurrentStep} />;
      default:
        return <Create setCurrentStep={setCurrentStep} />;
    }
  };

  useEffect(() => {
    if (isLogin && currentStep === 0) {
      alert('이미 로그인 되어있습니다.');
      router.push('/');
    }
  }, [currentStep, isLogin, router]);
  return (
    <div className="h-full w-9/12 mx-auto my-0">
      <div className="h-3/5 w-full bg-slate-200 mt-32 flex justify-center items-center">
        <div className="w-80 h-4/5 flex flex-col justify-between">
          <ProgressBar />
          {switchSignUpStep(currentStep)}
        </div>
      </div>
    </div>
  );
}

export default SignUp;

// export default function Login() {
//   import { stepState } from "@src/states/Auth";

//   return (
//     <MainLayout>
//       <div>This is Login Page</div>
//       {isAuthenticating && <Spinner />}
//       {step == AuthStep.READY && <Ready />}
//       {step == AuthStep.AGREE && <Agreements />}
//       {step == AuthStep.PROFILE_REQUIRED && (
//         <RequiredProfile />
//       )}
//     </MainLayout>
//   );
// }
