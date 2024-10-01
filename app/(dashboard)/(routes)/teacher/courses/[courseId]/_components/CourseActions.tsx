"use client";

import {
  DeleteCourseAction, PublishCourseAction, unpublishCourseAction
} from "@/app/services/TeacherAction";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useConfetti } from "@/Hooks/Confetti-store";
import { Course } from "@prisma/client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "sonner";

interface chapactionprops {
  course: Course;
  disabled: boolean;
}
const CourseActions = ({ course, disabled }: chapactionprops) => {
  const confetti = useConfetti((state) => state)
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [loading, setisloading] = useState(false);
  const deleCourse = async () => {
    try {
      setDeleting(true);
      const res = await DeleteCourseAction(course.id)
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Course deleted");
      router.push(`/teacher/courses/`);
      setDeleting(false);
    } catch (error) {
      toast.error("something went wrong");
      setDeleting(false);
    }
  };

  const PublishUnpublishCourse = async () => {
    try {
      setisloading(true);
      let res;
      if (course.isPublished) {
        res = await unpublishCourseAction(course);
        toast.success("course unpublished");
      } else {
        res = await PublishCourseAction(course);
        toast.success("course published");
        confetti.onOpen()
      }
      if (res?.error) {
        toast.error(res.error);
        setisloading(false);
        return;
      }
      setisloading(false);
    } catch (error) {
      toast.error("something went wrong");
      setisloading(false);
    }
  };
  return (
    <div className="flex gap-2 items-center">
      <Button
        onClick={PublishUnpublishCourse}
        size={"sm"}
        disabled={disabled || deleting || loading}
        variant={disabled ? "ghost" : "default"}
      >
        {course.isPublished ? "unpublish" : "publish"}
      </Button>
      <ConfirmDialog onConfirm={deleCourse}>
        <Button disabled={deleting || loading} size={"sm"}>
          <Trash className=" h-4 w-4 " />
        </Button>
      </ConfirmDialog>
    </div>
  );
};

export default CourseActions;
