import { Dispatch, SetStateAction } from 'react';

function ShowMore({ setIsClickChange }: { setIsClickChange: Dispatch<SetStateAction<boolean>> }) {
  return (
    <div
      onClick={() => setIsClickChange((prev) => !prev)}
      className="w-8 h-8 flex flex-col items-center justify-center cursor-pointer"
      aria-hidden="true"
    >
      <div className="border-gray-300 w-1.5 h-1.5 border rounded-full" />
      <div className="border-gray-300 mt-px w-1.5 h-1.5 border rounded-full" />
      <div className="border-gray-300 mt-px w-1.5 h-1.5 border rounded-full" />
    </div>
  );
}

export default ShowMore;
