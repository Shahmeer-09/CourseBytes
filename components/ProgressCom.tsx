"use client"

import React from "react";
import { Progress } from "./ui/progress";

interface progressComProps {
  value: number;
  variant?: "default" | "success";
  size?: "default" | "sm" | "lg";
}

// const colors = {
//   default: "bg-sky-700",
//   success: "bg-emerald-700",
// };
const sizes = {
  default: "text-sm",
  sm: "text-xs",
  lg: "text-xl",
};

const ProgressCom = ({ value, variant, size }: progressComProps) => {
  return (
    <div>
      <Progress value={value} className="h-2" variant={variant||"default"} />
      <p
        className={`font-medium mt-1 text-sky-700  ${
          sizes[size || "default"]
        } `}
      >
        {Math.round(value)}% completed
      </p>
    </div>
  );
};

export default ProgressCom;
