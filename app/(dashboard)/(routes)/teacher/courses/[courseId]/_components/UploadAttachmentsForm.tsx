"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  EarIcon,
  File,
  ImageIcon,
  Loader2,
  Pencil,
  PlusCircle,
  Trash,
} from "lucide-react";
import {
  ActionUpdateCourse,
  CreateAttachments,
  delAttachment,
} from "@/app/services/TeacherAction";
import { toast } from "sonner";

import { Attachments, Course } from "@prisma/client";
import { z } from "zod";
import Image from "next/image";
import UploadthingGenr from "@/components/UploadthingGenr";
import { AttachmentSchema } from "@/app/Zodschemas";
import { IconCustom } from "@/components/icon-custom";
import { useFormStatus } from "react-dom";
interface Titleformprops {
  initialData: Course & { attachments: Attachments[] };
}
const UploadAttachments = ({ initialData }: Titleformprops) => {
  const { pending } = useFormStatus();
  const [del, setdel] = useState<string | null>("");

  const [editing, setEditing] = useState(false);
  const TogleEditing = () => {
    setEditing(!editing);
  };

  const onsubmit = async (values: z.infer<typeof AttachmentSchema>) => {
    try {
      const data = await CreateAttachments(values.url, initialData.id);
      if (data?.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success("Attachment added successfully");
      }
      setEditing(false);
    } catch (error) {
      toast.error("something went wrong");
      return;
    }
  };
  const deleteAttachment = async (id: string) => {
    try {
      setdel(id.toString());
      const data = await delAttachment(id!, initialData.id);
      if (data?.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success("Attachment deletes successfully");
      }
      setEditing(false);
    } catch (error) {
      toast.error("something went wrong");
      return;
    } finally {
      setdel(null);
    }
  };
  return (
    <div className=" mt-6 border bg-slate-100 rounded-lg p-4 ">
      <div className=" flex justify-between items-center font-medium   ">
        Attachments
        <Button onClick={TogleEditing} variant={"ghost"}>
          {editing && <>cancel</>}
          {!editing && (
            <span className=" flex items-center gap-x-1  ">
              <PlusCircle className="h-4" />
              <p className=" text-muted-foreground text-xs ">Add a File</p>
            </span>
          )}
        </Button>
      </div>
      <>
        {!editing && initialData.attachments.length == 0 && (
          <div className=" text-sm text-muted-foreground italic mt-2  ">
            No Attachments yet
          </div>
        )}
        {!editing &&
          initialData.attachments.length > 0 &&
          initialData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className=" bg-sky-100   rounded-md border border-sky-300 hover:bg-sky-300/15 p-3 mt-2  flex items-center  justify-between "
            >
              <IconCustom size={"sm"} icon={File} />
              <span className=" text-sky-800  text-sm ml-1 line-clamp-1 ">
                {" "}
                {attachment.name}
              </span>
              <>
                {del?.toString() !== attachment?.id.toString() && (
                  <div
                    className=" ml-2   "
                    onClick={() => deleteAttachment(attachment.id.toString())}
                  >
                    <Trash className="h-4 w-4 cursor-pointer text-sky-700 " />
                  </div>
                )}
                {del && del?.toString() == attachment?.id.toString() && (
                  <div className="ml-2">
                    <Loader2 className=" text-sky-700  animate-spin h-4 w-4" />
                  </div>
                )}
              </>
            </div>
          ))}
      </>
      {editing && (
        <>
          <UploadthingGenr
            endpoint="attachmentFile"
            onchnage={(url) => {
              if (url) {
                onsubmit({ url: url });
              }
            }}
          />
          <div className=" text-sm text-muted-foreground   ">
            Upload any helping material or files your want to share along with
            the course
          </div>
        </>
      )}
    </div>
  );
};

export default UploadAttachments;
