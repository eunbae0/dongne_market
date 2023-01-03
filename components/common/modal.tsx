import { Dispatch, SetStateAction } from 'react';

function Modal({
  children,
  setStatus,
}: {
  children: React.ReactNode;
  setStatus: Dispatch<SetStateAction<boolean>>;
}) {
  const onclickModalOutside = () => {
    setStatus((prev) => !prev);
  };
  return (
    <div className="fixed top-0 left-0 h-full w-full z-10">
      <div
        onClick={onclickModalOutside}
        className="h-full w-full bg-slate-200 opacity-90"
        aria-hidden="true"
      />
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-6/12 bg-white">
        {children}
      </div>
    </div>
  );
}

export default Modal;
