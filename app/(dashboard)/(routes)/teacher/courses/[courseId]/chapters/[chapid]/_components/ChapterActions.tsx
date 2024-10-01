"use client";

import {
  DeleteChapterAction,
  PublishChapter,
  UnPublishChapter,
  updateChapterAction,
} from "@/app/services/TeacherAction";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Chapters } from "@prisma/client";
import { Trash } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "sonner";

interface chapactionprops {
  chapter: Chapters;
  disabled: boolean;
}
const ChapterActions = ({ chapter, disabled }: chapactionprops) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [loading, setisloading] = useState(false);
  const deleChapter = async () => {
    try {
      setDeleting(true);
      const res = await DeleteChapterAction(chapter.id, chapter.courseId!);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      toast.success("chapter deleted");
      router.push(`/teacher/courses/${chapter.courseId}`);
      setDeleting(false);
    } catch (error) {
      toast.error("something went wrong");
      setDeleting(false);
    }
  };

  const PublishUnpublishChapter = async () => {
    try {
      setisloading(true);
      let res;
      if (chapter.isPublished) {
        res = await UnPublishChapter(chapter);
        toast.success("chapter unpublished");
      } else {
        res = await PublishChapter(chapter);
        toast.success("chapter published");
      }
      if (res?.error) {
        toast.error(res.error);
        setisloading(false);
        return;
      }
      router.push(`/teacher/courses/${chapter.courseId}`);
      setisloading(false);
    } catch (error) {
      toast.error("something went wrong");
      setisloading(false);
    }
  };
  return (
    <div className="flex gap-2 items-center">
      <Button
        onClick={PublishUnpublishChapter}
        size={"sm"}
        disabled={disabled || deleting || loading}
        variant={disabled ? "ghost" : "default"}
      >
        {chapter.isPublished ? "unpublish" : "publish"}
      </Button>
      <ConfirmDialog onConfirm={deleChapter}>
        <Button disabled={deleting || loading} size={"sm"}>
          <Trash className=" h-4 w-4 " />
        </Button>
      </ConfirmDialog>
    </div>
  );
};

export default ChapterActions;
