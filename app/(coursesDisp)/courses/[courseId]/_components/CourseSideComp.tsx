"use client";

import { Button } from "@/components/ui/button";
import {
  Check,
  CheckCircle,
  CheckCircle2,
  Circle,
  LockIcon,
  LucideIcon,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
interface courssudebarprops {
  id: string;
  label: string;
  isCompleted: boolean;
  isLocked: boolean;
  courseId: string;
}
const CourseSideComp = ({
  id,
  label,
  isCompleted,
  isLocked,
  courseId,
}: courssudebarprops) => {
  const pathname = usePathname();
  const isActive = pathname.includes(id);
  const Icon = isLocked ? LockIcon : isCompleted ? CheckCircle2 : PlayCircle;
  return (
    <Link href={`/courses/${courseId}/chapters/${id}`} className="flex " >
      <Button
        variant={"ghost"}
        className={`flex transition-all cursor-pointer w-full items-center gap-x-2 py-0 h-12 justify-start font-semibold text-slate-500 hover:text-slate-600 hover:bg-slate-300/40  pl-6 
        ${isCompleted && "text-emerald-600 hover:text-emerald-600"} ${
          isActive && " text-slate-700 bg-slate-200/30 hover:bg-slate-200/30 "
        } 
        ${isCompleted && isActive && "bg-emerald-200/30"}`}
      >
        
        <div className=" flex items-center gap-x-2   ">
          <Icon
            size={22}
            className={`text-slate-500 ${isActive && "text-slate-700 "}${
              isCompleted && "text-emerald-600"
            } `}
          />
          {label}
        </div>
      </Button>
        <div
          className={` ml-auto transition-all h-full border-2  border-slate-700 ${
            isActive ? " opacity-100" : "opacity-0"
          } ${isCompleted && " border-emerald-700"} `}
        />
    </Link>
  );
};

export default CourseSideComp;
