"use client";
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { updateChapterAction } from '@/app/services/TeacherAction';
import { DescSchema } from '@/app/Zodschemas';
import { Editor } from '@/components/QuilEditor';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chapters } from '@prisma/client';
import { View } from '@/components/Quilview';

interface Titleformprops {
  initialData:Chapters
}
const ChapterDescForm = ({ initialData }: Titleformprops) => {
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
           const data = await updateChapterAction(values, initialData.id, initialData.courseId!);
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
            {initialData.description ? <View value={initialData.description} /> : "No description" }
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
                     <Editor {...field}/>
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

export default ChapterDescForm;
