"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TypeOf, z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { TitleSchema } from "@/app/Zodschemas";
import { ActionUpdateCourse, updateChapterAction } from "@/app/services/TeacherAction";
import { toast } from "sonner";
import { Chapters } from "@prisma/client";
interface Titleformprops {
  initialData: Chapters
}
const ChapTitleForm = ({ initialData }: Titleformprops) => {
  const [editing, setEditing] = useState(false);
  const TogleEditing = () => {
    setEditing(!editing);
  };

  const form = useForm<z.infer<typeof TitleSchema>>({
    resolver: zodResolver(TitleSchema),
    defaultValues: initialData,
  });
  const {isSubmitting, isValid} = form.formState;

  const onsubmit = async (values: z.infer<typeof TitleSchema>) => {
     try {
           const data = await updateChapterAction(values, initialData.id, initialData.courseId!);
           if(data?.error){
            toast.error(data.error);
            return;
           }else{
            toast.success("chapter updated successfully");
           }
           setEditing(false)
     } catch (error) {
         toast.error("something went wrong");
         return
     }
  };
  return (
    <div className=" mt-6 border bg-slate-100 rounded-lg p-4 ">
      <div className=" flex justify-between items-center font-medium   ">
        chapter title
        <Button onClick={TogleEditing} variant={"ghost"}>
          {editing ? (
            <>cancel</>
          ) : (
            <span className=" flex items-center gap-x-1  " >
              <Pencil className="h-4"  /> <p className=" text-muted-foreground text-xs " >Edit Title</p>
            </span>
          )}
        </Button>
      </div>
      {!editing ? (
        <div className=" text-sm tex  ">{initialData.title}</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} className=" space-y-2 mt-3 ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input disabled={isSubmitting}  placeholder="e.g, Web dev" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2 ">
                <Button disabled={isSubmitting||!isValid} >save</Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default ChapTitleForm;
