import Userbtn from "@/app/(dashboard)/_components/Userbtn";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Chapters, Course, UserProgress } from "@prisma/client";
import React from "react";
import MobileCourseSidebar from "./MobileCourseSidebar";
import { IsTeacher } from "@/lib/AdminFilter";
interface navbarcourses {
  course: Course & {
    chapters: (Chapters & { userProgress: UserProgress[] | null })[];
  };
  progressCount: number | undefined;
}
const Navbarcourses = async ({ course, progressCount }: navbarcourses) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isadmin = IsTeacher(user?.id)
  return (
    <div className=" md:pl-80 z-50 bg-white  w-full shadow-md h-[80px] flex items-center justify-between fixed p-4 ">
      <MobileCourseSidebar course={course} progressCount={progressCount} />
      <div className="w-full flex justify-end  " >
        <Userbtn
          name={user?.given_name!}
          email={user?.email!}
          image={user.picture || ""}
          isadmin={isadmin}
        />
      </div>
    </div>
  );
};

export default Navbarcourses;
