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
import { DescSchema, PriceSchema } from "@/app/Zodschemas";
import { ActionUpdateCourse } from "@/app/services/TeacherAction";
import { toast } from "sonner";
import { Course } from "@prisma/client";
import { formatPrice } from "@/lib/PriceFormat";
interface Titleformprops {
  initialData: Course;
}
const PriceForm = ({ initialData }: Titleformprops) => {
  const [editing, setEditing] = useState(false);
  const TogleEditing = () => {
    setEditing(!editing);
  };

  const form = useForm<z.infer<typeof PriceSchema>>({
    resolver: zodResolver(PriceSchema),
    defaultValues: {
      Price: initialData.Price || undefined,
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onsubmit = async (values: z.infer<typeof PriceSchema>) => {
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
        Price
        <Button onClick={TogleEditing} variant={"ghost"}>
          {editing ? (
            <>cancel</>
          ) : (
            <span className=" flex items-center gap-x-1  ">
              <Pencil className="h-4" />{" "}
              <p className=" text-muted-foreground text-xs ">Edit Price</p>
            </span>
          )}
        </Button>
      </div>
      {!editing ? (
        <div
          className={`${
            initialData.Price
              ? " text-sm  "
              : " italic text-sm  text-muted-foreground  "
          }`}
        >
          {initialData.Price ? formatPrice(initialData.Price).toString() : "No Price"}
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
                name="Price"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" step={0.01} {...field} />
                    </FormControl>
                    <FormMessage />
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

export default PriceForm;
