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
import Link from "next/link";
import { ActionCreateCourse } from "@/app/services/TeacherAction";
import { TitleSchema } from "@/app/Zodschemas";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";


const page = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof TitleSchema>>({
    resolver: zodResolver(TitleSchema),
    defaultValues: {
      title: "",
    },
  });

  const onsubmit = async (values: z.infer<typeof TitleSchema>) => {
      const data = await ActionCreateCourse(values);
      if (data?.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success("Course created successfully");
        router.push(`/teacher/courses/${data?.data?.id}`);
      }
  };
  const { isSubmitting, isValid } = form.formState;
  return (
    <div className=" max-w-5xl p-6  mx-auto flex  md:items-center md:justify-center  h-full  ">
      <div className=" flex flex-col gap-y-4  " >
        <h1 className=" text-2xl ">Give your course a name</h1>
        <p className=" text-sm text-muted-foreground ">
          {" "}
          Decide a neme for your course! And don't Worry you can always change
          it .{" "}
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)}  className=" flex flex-col gap-y-2 "  >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g, Web development" {...field} />
                  </FormControl>
                  <FormDescription>What you gonna teach?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className=" flex items-center gap-x-4 ">
              <Button type="button" variant={"ghost"} asChild>
                <Link href={"/"}>cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || !isValid}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
