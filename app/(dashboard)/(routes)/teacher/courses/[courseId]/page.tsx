import { IconCustom } from "@/components/icon-custom";
import { prisma } from "@/lib/db";
import React from "react";
import {
  CircleDollarSign,
  File,
  LayoutGridIcon,
  ListCheck,
} from "lucide-react";
import TitleForm from "./_components/TitleForm";
import DesciptionForm from "./_components/DescripionForm";
import UploadImageForm from "./_components/UploadImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
import UploadAttachments from "./_components/UploadAttachmentsForm";
import CahptersForm from "./_components/ChaptersForm";
import { Banner } from "@/components/PublishBanner";
import CourseActions from "./_components/CourseActions";
import { useConfetti } from "@/Hooks/Confetti-store";
const getCourse = async (courseid: string) => {
 
  const course = await prisma.course.findUnique({
    where: {
      id: courseid,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  return course;
};

const getCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return categories;
};
const selectedcourse = async ({ params }: { params: { courseId: string } }) => {
  const course = await getCourse(params.courseId);
  const categories = await getCategories();
  if (!course) {
    return (
      <div className=" h-full flex items-start justify-center ">
        <div className="  p-6 text-center ">
          <h2 className=" text-2xl text-rose-600 font-medium  ">
            {" "}
            *No course found{" "}
          </h2>
          <p className=" text-sm text-muted-foreground ">
            {" "}
            Go back and try again{" "}
          </p>
        </div>
      </div>
    );
  }

  const requiredFields = [
    course.chapters.length!=0,
    course.description,
    course.imageUrl,
    course.attachments,
    course.CategoryID,
    course.Price,
    
  ];

  const totalfields = requiredFields.length;
  const filledFields = requiredFields.filter(Boolean).length;
  const progress = `(${filledFields}/${totalfields})`;
  const isComplete = requiredFields.every(Boolean)
  console.log(isComplete)
  console.log(course.isPublished)
  return (
    <>
   
      {!course.isPublished && 
      <Banner variant={"warning"} label="This Course is not published yet" />   
      }
    <div className="p-6">
      <div className=" flex items-center justify-between w-full  ">
        <div className=" flex-col gap-y-4   ">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className=" text-muted-foreground text-sm">
            complete all fields {progress}
          </span>
        </div>
        <CourseActions course={course} disabled={!isComplete}  />
      </div>
      <div className=" mt-16 grid grid-cols-1 md:grid-cols-2  gap-x-3 ">
        <div className=" flex-col   ">
          <div className=" flex items-center gap-x-2">
            <IconCustom icon={LayoutGridIcon} />
            <h1 className="font-medium  ">Customize your course</h1>
          </div>
          <TitleForm initialData={course} />
          <DesciptionForm initialData={course} />
          <UploadImageForm initialData={course} />
          <CategoryForm
            options={categories.map((val) => {
              return { value: val.id, label: val.name };
            })}
            initialData={course}
          />
        </div>
        <div className=" space-y-6 ">
          <div>
            <div className=" flex items-center gap-x-2 ">
              <IconCustom icon={ListCheck} />
              <h1 className=" font-medium ">Course Chapters</h1>
            </div>
            <div>
              <CahptersForm initialData={course} />
            </div>
          </div>
          <div>
            <div className=" flex items-center gap-x-2  ">
              <IconCustom icon={CircleDollarSign} />
              <h1>Sell your Course</h1>
            </div>
            <PriceForm initialData={course} />
          </div>
          <div>
            <div className=" flex items-center gap-x-2  ">
              <IconCustom icon={File} />
              <h1>Provide Attachments</h1>
            </div>
            <UploadAttachments initialData={course} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default selectedcourse;
