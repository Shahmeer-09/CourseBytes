import { getPorgress } from "@/app/services/CourseAction";
import { prisma } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CourseSidebar from "./_components/CourseSidebar";
import Navbarcourses from "./_components/Navbarcourses";

const getCourse = async (courseid: string, userid: string) => {
  const data = await prisma.course.findUnique({
    where: {
      id: courseid,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId: userid,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  return data;
};

const layout = async ({
  children,
  params,
}: {
  params: { courseId: string };
  children: React.ReactNode;
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect(`/`);
  }
  const data = await getCourse(params.courseId, user.id.toString());
  const progressCount = await getPorgress(user.id.toString(), params.courseId);
  if (!data) {
    return redirect("/");
  }
  return (
    <div className=" h-full ">
      <div className=" hidden md:flex h-full flex-col w-80 fixed inset-y-0 z-[70] bg-white shadow-sm  ">
        <CourseSidebar course={data} progressCount={progressCount} />
      </div>
      <div>
        <Navbarcourses course={data} progressCount={progressCount} />
        <main className=" md:pl-80 pt-[80px]   h-full ">{children}</main>
      </div>
    </div>
  );
};

export default layout;
