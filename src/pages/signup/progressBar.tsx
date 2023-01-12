import { useRecoilValue } from 'recoil';
import { authCurrentStep } from '../../recoil/state';

function ProgressBar() {
  const currentStep = useRecoilValue(authCurrentStep);
  const returnProgressBarByCurrentStep = (cur: number) => {
    switch (cur) {
      case 0:
        return (
          <>
            <div className="w-7 h-7 rounded-full bg-purple-600" />
            <div className="w-32 h-1 mx=0 my-auto bg-purple-300" />
            <div className="w-7 h-7 rounded-full bg-purple-300" />
            <div className="w-32 h-1 mx=0 my-auto bg-purple-300" />
            <div className="w-7 h-7 rounded-full bg-purple-300" />
          </>
        );
      case 1:
        return (
          <>
            <div className="w-7 h-7 rounded-full bg-purple-600" />
            <div className="w-32 h-1 mx=0 my-auto bg-purple-600" />
            <div className="w-7 h-7 rounded-full bg-purple-600" />
            <div className="w-32 h-1 mx=0 my-auto bg-purple-300" />
            <div className="w-7 h-7 rounded-full bg-purple-300" />
          </>
        );
      case 2:
        return (
          <>
            <div className="w-7 h-7 rounded-full bg-purple-600" />
            <div className="w-32 h-1 mx=0 my-auto bg-purple-600" />
            <div className="w-7 h-7 rounded-full bg-purple-600" />
            <div className="w-32 h-1 mx=0 my-auto bg-purple-600" />
            <div className="w-7 h-7 rounded-full bg-purple-600" />
          </>
        );
      default:
        return (
          <>
            <div className="w-7 h-7 rounded-full bg-purple-600" />
            <div className="w-32 h-1 mx=0 my-auto bg-purple-300" />
            <div className="w-7 h-7 rounded-full bg-purple-300" />
            <div className="w-32 h-1 mx=0 my-auto bg-purple-300" />
            <div className="w-7 h-7 rounded-full bg-purple-300" />
          </>
        );
    }
  };
  return <div className="flex justify-center">{returnProgressBarByCurrentStep(currentStep)}</div>;
}

export default ProgressBar;
