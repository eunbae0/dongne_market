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
    <div
      onClick={onclickModalOutside}
      className="fixed h-screen w-screen bg-slate-200"
      aria-hidden="true"
    >
      <div className="flex items-center justify-center">{children}</div>
    </div>
  );
}

export default Modal;
