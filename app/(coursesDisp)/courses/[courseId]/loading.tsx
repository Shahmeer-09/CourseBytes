import { LoaderCircle, LoaderIcon } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className=" flex items-center justify-center h-[100vh]  ">
      <div>
        <LoaderIcon className=" animate-spin h-20 w-20 text-sky-500 " />
      </div>
    </div>
  );
};

export default loading;
