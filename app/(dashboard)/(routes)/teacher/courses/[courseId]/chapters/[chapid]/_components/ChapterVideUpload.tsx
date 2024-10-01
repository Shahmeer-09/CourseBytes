"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { VideoUploadSchema } from "@/app/Zodschemas";
import { updateChapterAction } from "@/app/services/TeacherAction";
import { toast } from "sonner";
import { Chapters } from "@prisma/client";
import { z } from "zod";
import UploadthingGenr from "@/components/UploadthingGenr";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });
interface Titleformprops {
  initialData: Chapters;
}
const ChapterVideUpload = ({ initialData }: Titleformprops) => {
  const [editing, setEditing] = useState(false);
  const TogleEditing = () => {
    setEditing(!editing);
  };

  const onsubmit = async (values: z.infer<typeof VideoUploadSchema>) => {
    try {
      const data = await updateChapterAction(
        values,
        initialData.id,
        initialData.courseId!
      );
      if (data?.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success("Chapter updated successfully");
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
        Chapter Video
        <Button onClick={TogleEditing} variant={"ghost"}>
          {editing && <>cancel</>}
          {!editing && !initialData.videoUrl && (
            <span className=" flex items-center gap-x-1  ">
              <PlusCircle className="h-4" />
              <p className=" text-muted-foreground text-xs ">Upload an Video</p>
            </span>
          )}
          {!editing && initialData.videoUrl && (
            <span className=" flex items-center gap-x-1  ">
              <Pencil className="h-4" />
              <p className=" text-muted-foreground text-xs ">Edit the Video</p>
            </span>
          )}
        </Button>
      </div>
       {!editing && initialData.videoUrl && (
        <p className=" my-2  text-sm  text-muted-foreground ">
         video uploaded
        </p>
      ) }
      {!editing && !initialData?.videoUrl && (
        <div className=" flex items-center  bg-gray-200 justify-center h-60  rounded-md  ">
          <VideoIcon className="h-10 w-10 text-slate-500   " />
        </div>
      )}
      {!editing && initialData.videoUrl && (
        <div
          className="h-60 w-full relative"
          style={{ position: "relative", paddingTop: "56.25%" }}
        >
          <ReactPlayer
            url={initialData.videoUrl}
            controls
            playing
            width="100%" // Ensures the player takes the full width of the container
            height="100%" // Ensures the player takes the full height of the container
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </div>
      )}
      {editing && (
        <UploadthingGenr
          endpoint="chapterVids"
          onchnage={(url) => {
            if (url) {
              onsubmit({ videoUrl: url });
            }
          }}
        />
      )}
      {!editing && initialData.videoUrl && (
        <div className=" mt-4 " >
          <p className=" text-sm  text-muted-foreground ">
            Please wait a moment it takes some time to load the image!
          </p>
        </div>
      )}
    </div>
  );
};

export default ChapterVideUpload;
