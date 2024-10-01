"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { EarIcon, ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { DescSchema, ImageUploadSchema } from "@/app/Zodschemas";
import { ActionUpdateCourse } from "@/app/services/TeacherAction";
import { toast } from "sonner";

import { Course } from "@prisma/client";
import { z } from "zod";
import Image from "next/image";
import UploadthingGenr from "@/components/UploadthingGenr";
interface Titleformprops {
  initialData: Course;
}
const UploadImageForm = ({ initialData }: Titleformprops) => {
  const [editing, setEditing] = useState(false);
  const TogleEditing = () => {
    setEditing(!editing);
  };

  const onsubmit = async (values: z.infer<typeof ImageUploadSchema>) => {
    try {
      const data = await ActionUpdateCourse(values, initialData.id);
      if (data?.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success("Course updated successfully");
      }
      setEditing(false);
    } catch (error) {
      toast.error("something went wrong");
      return;
    }
  };
  return (
    <div className=" mt-6 border bg-slate-100 rounded-lg p-4 ">
      <div className=" flex justify-between items-center font-medium   ">
        Course Image
        <Button onClick={TogleEditing} variant={"ghost"}>
          {editing && <>cancel</>}
          {!editing && !initialData?.imageUrl && (
            <span className=" flex items-center gap-x-1  ">
              <PlusCircle className="h-4" />
              <p className=" text-muted-foreground text-xs ">Upload an image</p>
            </span>
          )}
          {!editing && initialData?.imageUrl && (
            <span className=" flex items-center gap-x-1  ">
              <Pencil className="h-4" />
              <p className=" text-muted-foreground text-xs ">Edit the image</p>
            </span>
          )}
        </Button>
      </div>
      {!editing && !initialData?.imageUrl && (
        <div className=" flex items-center  justify-center h-60  rounded-md  ">
          <ImageIcon className="h-10 w-10 text-slate-500   " />
        </div>
      )}
      {!editing && initialData.imageUrl && (
        <div className=" aspect-video mt-2 relative ">
          <Image fill className=" object-cover rounded-md " alt="imageForm" src={initialData.imageUrl} />
        </div>
      )}
      {editing && (
        <UploadthingGenr
          endpoint="imageUploader"
          onchnage={(url) => {
            if (url) {
              onsubmit({ imageUrl: url });
            }
          }}
        />
      )}
    </div>
  );
};

export default UploadImageForm;
