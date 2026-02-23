import React from "react";

interface Props {
  isOpen: boolean;
  IsClose: () => void;
}

const TestModel = ({ isOpen, IsClose }: Props) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed flex justify-center items-center inset-0 z-50 bg-slate-800/50 backdrop-blur-md">
        <div className="bg-white p-8">
          <div>Hello</div>
          <button onClick={IsClose}>Close</button>
        </div>
      </div>
    </>
  );
};

export default TestModel;
