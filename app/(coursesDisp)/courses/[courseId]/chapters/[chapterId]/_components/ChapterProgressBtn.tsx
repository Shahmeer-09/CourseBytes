"use client";

import { progressUpdate } from "@/app/services/progress";
import { Button } from "@/components/ui/button";
import { useConfetti } from "@/Hooks/Confetti-store";
import { Chapters, Course, UserProgress } from "@prisma/client";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
interface chapterprogressbtnprops {
  chapid: string;
  course: Partial<
    Course & {
      chapters: Partial<
        Chapters & {
          userProgress: UserProgress[];
        }
      >[];
    }
  >;
  iscompleted: boolean;
  nextchapterid: string;
}

export const ChapterProgressBtn = ({
  chapid,

  course,
  iscompleted,
  nextchapterid,
}: chapterprogressbtnprops) => {
  const Icon = iscompleted ? XCircle : CheckCircle;
  const confetti = useConfetti((state) => state);
  const router = useRouter();
  const [loading, setloading] = useState(false);

  const onSubmit = async () => {
    try {
      setloading(true);
       const res= await progressUpdate(chapid, !iscompleted,course.id!);
      
      if (!iscompleted  && res.completed) {
        confetti.onOpen();
      }
      if (!iscompleted && nextchapterid) {
        router.push(`/courses/${course.id}/chapters/${nextchapterid}`);
      }
      toast.success("progress updated");
      setloading(false);
    } catch (error) {
      toast.error("something went wrong");
      setloading(false);
    }
  };
  const variant = iscompleted ? "ghost" : "success";
  return (
    <>
      <Button
        type="button"
        disabled={loading}
        onClick={onSubmit}
        className="w-full md:w-auto"
        variant={variant}
      >
        {iscompleted ? "Not completed" : "Mark as complete"}
        <Icon className="ml-2 h-4 w-4" />
      </Button>
    </>
  );
};
