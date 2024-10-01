"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { set, TypeOf, z } from "zod";
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
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { chapterSchema, DescSchema } from "@/app/Zodschemas";
import {
  ActionUpdateCourse,
  CreateAchapters,
  reorderAction,
} from "@/app/services/TeacherAction";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Chapters, Course } from "@prisma/client";
import ChapterList from "./ChapterList";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
interface Titleformprops {
  initialData: Course & { chapters: Chapters[] };
}
const CahptersForm = ({ initialData }: Titleformprops) => {
  const router = useRouter()
  const [updating, setupdating] = useState(false);
  const [creating, setisCreating] = useState(false);
  const TogleEditing = () => {
    setisCreating(!creating);
  };

  const form = useForm<z.infer<typeof chapterSchema>>({
    resolver: zodResolver(chapterSchema),
  });
  const { isSubmitting, isValid } = form.formState;

  const onsubmit = async (values: z.infer<typeof chapterSchema>) => {
    try {
      const data = await CreateAchapters(values, initialData.id);
      if (data?.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success("Cahpter Created Successfully");
      }
      setisCreating(false);
    } catch (error) {
      toast.error("something went wrong");
      return;
    }
  };
  const onReorder = async (updatedData: { id: string; position: number }[]) => {
    try {
      setupdating(true);
      const data = await reorderAction(updatedData, initialData.id);
      if (data?.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success("course updated successfully");
      }
      setupdating(false);
    } catch (error) {
      toast.error("something went wrong");
      setupdating(false);
      return;
    }
  };

  const onEdit = (chapid:string)=>{
    router.push(`/teacher/courses/${initialData.id}/chapters/${chapid}`)
  }
  return (
    <div className=" mt-6 border relative  bg-slate-100 rounded-lg p-4 ">
      {updating && (
        <div className=" flex items-center justify-center  absolute right-0 top-0 h-full w-full bg-sky-500/15 ">
          <Loader2 className=" animate-spin h-10 w-10 text-sky-800  " />
        </div>
      )}
      <div className=" flex justify-between items-center font-medium   ">
        Chapters of Course
        <Button onClick={TogleEditing} variant={"ghost"}>
          {creating ? (
            <>cancel</>
          ) : (
            <span className=" flex items-center gap-x-1  ">
              <PlusCircle className="h-4" />{" "}
              <p className=" text-muted-foreground text-xs ">Create chapter</p>
            </span>
          )}
        </Button>
      </div>
      {!creating ? (
        <div
          className={`${
            initialData.chapters.length
              ? " text-sm  "
              : " italic text-sm  text-muted-foreground  "
          }`}
        >
          {!initialData.chapters.length && "No chapter"}

          <ChapterList
            onEdit={onEdit}
            items={initialData.chapters || []}
            onReorder={onReorder}
          />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onsubmit)}
              className=" space-y-2 mt-3 "
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g, chapter 1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2 ">
                <Button disabled={isSubmitting || !isValid}>create</Button>
              </div>
            </form>
          </Form>
        </>
      )}
      {!creating && (
        <div className=" text-sm italic text-muted-foreground mt-2">
          drag nd drop to reorder or the chaptes
        </div>
      )}
    </div>
  );
};

export default CahptersForm;
