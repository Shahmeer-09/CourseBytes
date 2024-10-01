"use client";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  ActionUpdateCourse,
  updateChapterAction,
} from "@/app/services/TeacherAction";
import { AccessChapterSchema, DescSchema } from "@/app/Zodschemas";
import { Editor } from "@/components/QuilEditor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapters } from "@prisma/client";
import { View } from "@/components/Quilview";
import { Checkbox } from "@/components/ui/checkbox";

interface Titleformprops {
  initialData: Chapters;
}
const AccessChapterForm = ({ initialData }: Titleformprops) => {
  const [editing, setEditing] = useState(false);
  const TogleEditing = () => {
    setEditing(!editing);
  };

  const form = useForm<z.infer<typeof AccessChapterSchema>>({
    resolver: zodResolver(AccessChapterSchema),
  });
  const { isSubmitting, isValid } = form.formState;

  const onsubmit = async (values: z.infer<typeof AccessChapterSchema>) => {
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
        Acess settingd
        <Button onClick={TogleEditing} variant={"ghost"}>
          {editing ? (
            <>cancel</>
          ) : (
            <span className=" flex items-center gap-x-1  ">
              <Pencil className="h-4" />{" "}
              <p className=" text-muted-foreground text-xs ">Edit access</p>
            </span>
          )}
        </Button>
      </div>
      {!editing ? (
        <div
          className={`${
            initialData.description
              ? " text-sm  "
              : " italic text-sm  text-muted-foreground  "
          }`}
        >
          {initialData.isFree
            ? "This chapter is free to view"
            : "This chapter is not free"}
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
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormDescription>
                        You can set this chapter as free to view for everyone
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2 ">
                <Button disabled={isSubmitting || !isValid}>save</Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default AccessChapterForm;
