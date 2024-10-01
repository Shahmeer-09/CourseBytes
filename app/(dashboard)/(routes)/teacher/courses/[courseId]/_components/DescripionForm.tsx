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
import { DescSchema } from "@/app/Zodschemas";
import { ActionUpdateCourse } from "@/app/services/TeacherAction";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
interface Titleformprops {
  initialData: {
    id : string
    description?: string| null;
  };
}
const DesciptionForm = ({ initialData }: Titleformprops) => {
  const [editing, setEditing] = useState(false);
  const TogleEditing = () => {
    setEditing(!editing);
  };

  const form = useForm<z.infer<typeof DescSchema>>({
    resolver: zodResolver(DescSchema),
  });
  const {isSubmitting, isValid} = form.formState;

  const onsubmit = async (values: z.infer<typeof DescSchema>) => {
     try {
           const data = await ActionUpdateCourse(values, initialData.id);
           if(data?.error){
            toast.error(data.error);
            return;
           }else{
            toast.success("Course updated successfully");
           }
           setEditing(false);
     } catch (error) {
         toast.error("something went wrong");
         return
     }
  };
  return (
    <div className=" mt-6 border bg-slate-100 rounded-lg p-4 ">
      <div className=" flex justify-between items-center font-medium   ">
        Description 
        <Button onClick={TogleEditing} variant={"ghost"}>
          {editing ? (
            <>cancel</>
          ) : (
            <span className=" flex items-center gap-x-1  " >
              <Pencil className="h-4"  /> <p className=" text-muted-foreground text-xs " >Edit Desc.</p>
            </span>
          )}
        </Button>
      </div>
      {!editing ? (
        <div className={`${initialData.description? " text-sm  ":" italic text-sm  text-muted-foreground  "}`}>
            {initialData.description ? initialData.description  : "No description" }
            </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} className=" space-y-2 mt-3 ">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl> 
                      <Textarea disabled={isSubmitting}  placeholder="e.g, About your course.." {...field} />
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

export default DesciptionForm;
