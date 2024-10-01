import { getDashbordCourses } from "@/app/services/CourseAction";
import React from "react";
import CourseCarddash from "./_components/CourseCarddash";
import InfoBar from "./_components/InfoBar";
import { CheckCircle, Clock } from "lucide-react";

const page = async () => {
  const { completeCourses, courseInprogress } = await getDashbordCourses();
  const data = [...completeCourses, ...courseInprogress];
  return (
    <>
      <div className= " flex flex-col  sm:flex-row   ">
        <InfoBar
          length={completeCourses.length}
          icon={CheckCircle}
          variant={"default"}
          label={"Completed"}
        />
        <InfoBar
          length={courseInprogress.length}
          icon={Clock}
          variant={"default"}
          label={"In progress"}
        />
      </div>
      <div className=" mx-4  ">
        <div className=" grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 ">
          
          {data?.map((item) => (
            <CourseCarddash
              key={item.id}
              id={item.id}
              imageurl={item.imageUrl!}
              title={item.title}
              category={item.category?.name!}
              chapterslength={item.chapters.length}
              price={item.Price!}
              progress={item.progress!}
            />
          ))}
        </div>
        {data?.length == 0 && (
          <div className="  text-center mt-10   ">
            <p className=" md:text-lg text-sm text-muted-foreground  ">
              No courses found
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default page;
