"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.bubble.css";

interface editorprops {
  value: string;
  fontsize?: string;
  fontweight?: string;
}

export const View = ({ value, fontsize, fontweight }: editorprops) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return (
    <div className="  bg-white">
      <ReactQuill
        theme="bubble"
        value={value}
        readOnly={true}
      />
    </div>
  );
};
