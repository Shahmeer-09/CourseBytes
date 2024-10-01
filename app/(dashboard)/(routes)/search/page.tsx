import { prisma } from "@/lib/db";
import React from "react";
import Categories from "./_components/Categories";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getCourse } from "@/app/services/CourseAction";
import CourseCard from "./_components/CourseCard";

const getCategories = async () => {
  const data = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return data;
};
type searchParamstype ={
  searchParams:{
    title:string,
    categoryId:string
  }
}
const page = async ({
  searchParams,
}: searchParamstype) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const items = await getCategories();
  const { data } = await getCourse({
    userid: user?.id,
    title:searchParams.title,
    categoryId: searchParams.categoryId,
  });
  console.log(data)

  return (
    <>
      <Categories items={items} />
      <div className=" mx-4  ">
        <div className=" grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 ">
          {data?.map((item) => (
            <CourseCard
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
