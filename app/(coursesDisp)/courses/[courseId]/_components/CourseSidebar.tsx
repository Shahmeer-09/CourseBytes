import { prisma } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Chapters, Course, UserProgress } from "@prisma/client";
import CourseSideComp from "./CourseSideComp";
import ProgressCom from "@/components/ProgressCom";

interface coursesidebarprops {
  course: Course & {
    chapters: (Chapters & { userProgress: UserProgress[] | null })[];
  };
  progressCount: number | undefined;
}

const CourseSidebar = async ({ course, progressCount }: coursesidebarprops) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: user?.id,
        courseId: course.id,
      },
    },
  });

  return (
    <div className=" h-full flex flex-col shadow-sm overflow-y-auto border-r ">
      <div className=" p-8  flex flex-col border-b ">
        <h1 className=" font-medium text-lg capitalize text-blue-800   ">
          {course.title}
        </h1>
        {purchase && (
          <div className="mt-4" >
            <ProgressCom value={progressCount!} variant="default" />
          </div>
        )}
      </div>
      <div className=" flex flex-col  mt-2   ">
        {course.chapters.map((chapter) => (
          <CourseSideComp
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter?.userProgress?.[0]?.isCompleted}
            isLocked={!chapter.isFree && !purchase}
            courseId={course?.id}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
