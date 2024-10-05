"use server";

import { prisma } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { category, Chapters, Course } from "@prisma/client";

export const getPorgress = async (userid: string, courseId: string) => {
  try {
    const chapters = await prisma.chapters.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const chapterIds = chapters.map((chapter) => chapter.id);
    let progress = 0;
    if (userid) {
      progress = await prisma.userProgress.count({
        where: {
          userId: userid,
          chapterId: {
            in: chapterIds,
          },
          isCompleted: true,
        },
      });
    }

    const totalChapters = chapters.length;
    const progressPercentage =
      totalChapters > 0 ? Math.round((progress / totalChapters) * 100) : 0;
    return progressPercentage;
  } catch (error) {
    console.log("[progressAction]", error);
  }
};
interface getcoursetype {
  userid: string;
  title?: string;
  categoryId?: string;
}
export const getCourse = async ({
  userid,
  title,
  categoryId,
}: getcoursetype) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        title: {
          contains: title,
        },
        isPublished: true,
        CategoryID: categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId: userid,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const validatedCourses = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length > 0) {
          const progress = await getPorgress(userid, course.id);
          return { ...course, progress };
        } else {
          return { ...course, progress: null };
        }
      })
    );

    return { data: validatedCourses };
  } catch (error) {
    console.log("[GetCourse]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};

type coursedashbordData = Course & {
  chapters: Chapters[];
  category: category;
  progress?: number;
};

interface dashbordcoursetype {
  completeCourses: coursedashbordData[];
  courseInprogress: coursedashbordData[];
}

export const getDashbordCourses = async (): Promise<dashbordcoursetype> => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("unauthorized");
    }

    const coursespurchased = await prisma.purchase.findMany({
      where: {
        userId: user?.id,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });
    const courses = coursespurchased.map(
      (puchase) => puchase?.course
    ) as coursedashbordData[];
    for (const course of courses) {
      const progress = await getPorgress(user.id, course?.id!);
      course["progress"] = progress;
    }

    const completeCourses = courses.filter(
      (course) => course.progress === 100
    ) as coursedashbordData[];
    const courseInprogress = courses.filter(
      (course) =>(course.progress?? 0) < 100
    ) as coursedashbordData[];
    return { completeCourses, courseInprogress };
  } catch (error) {
    return {
      completeCourses: [],
      courseInprogress: [],
    };
  }
};
