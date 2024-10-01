"use server";
import { string, z } from "zod";
import { TitleSchema } from "../Zodschemas";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Attachments, Chapters, Course } from "@prisma/client";
import { redirect } from "next/dist/server/api-utils";

export interface typecourse {
  id: string;
  userId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  Price: number;
  isPublished: boolean;
  CategoryID?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ActionCreateCourse = async (
  formdata: z.infer<typeof TitleSchema>
) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("user is not authenticated");
    }
    const result = TitleSchema.safeParse(formdata);
    if (!result.success) {
      throw new Error("provided data is not in correct format");
    }

    const course = await prisma.course.create({
      data: {
        userId: user?.id,
        title: formdata.title,
      },
    });
    return { data: course };
  } catch (error) {
    console.log("[createCourse]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};

export const ActionUpdateCourse = async (
  formdata: Partial<typecourse>,
  courseid: string
) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("you are not authenticated");
    }
    const course = await prisma.course.update({
      where: {
        id: courseid,
      },
      data: {
        ...formdata,
      },
    });
    revalidatePath("/teacher/courses/");
    return { data: course };
  } catch (error) {
    console.log("[updateCourse]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};

// #########  attachments

export const CreateAttachments = async (url: string, courseID: string) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("you are not authenticated");
    }
    const FindCourse = await prisma.course.findUnique({
      where: {
        id: courseID,
        userId: user?.id,
      },
    });

    if (!FindCourse) {
      throw new Error("unauthorized to perform this action");
    }

    await prisma.attachments.create({
      data: {
        url: url,
        name: url.split("/").pop() as string,
        courseId: courseID,
      },
    });

    revalidatePath("/teacher/courses/");
  } catch (error) {
    console.log("[Createattachments]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};

export const delAttachment = async (del: string, courseId: string) => {
  console.log(del);
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("you are not authenticated");
    }
    const FindCourse = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: user?.id,
      },
    });

    if (!FindCourse) {
      throw new Error("unauthorized to perform this action");
    }

    const data = await prisma.attachments.delete({
      where: {
        id: del,
        courseId: courseId,
      },
    });
    console.log(data);
    revalidatePath("/teacher/courses/");
  } catch (error) {
    console.log("[Createattachments]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};

export const DeleteCourseAction = async (courseId: string) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("you are not authenticated");
    }
    const FindCourse = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: user?.id,
      },
    });

    if (!FindCourse) {
      throw new Error("unauthorized to perform this action");
    }

    const findcourse = await prisma.course.findFirst({
      where: {
        id: courseId,
      },
    });
    if (!findcourse) {
      throw new Error("course not found");
    }
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });
    revalidatePath("/teacher/courses/");
  } catch (error) {
    console.log("[DeletAcourse]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};
export const PublishCourseAction = async (course: Course) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("you are not authenticated");
    }
    const FindCourse = await prisma.course.findUnique({
      where: {
        id: course.id,
        userId: user?.id,
      },
      include: {
        chapters: true,
      },
    });

    if (!FindCourse) {
      throw new Error("unauthorized to perform this action");
    }
    const publishechapters = FindCourse.chapters.some(
      (chapter) => chapter.isPublished
    );
    if (
      !course.description ||
      !course.CategoryID ||
      !course.Price ||
      !course.imageUrl ||
      !publishechapters
    ) {
      throw new Error("please fill all the required fields");
    }
    await prisma.course.update({
      where: {
        id: course.id,
      },
      data: {
        isPublished: true,
      },
    });
    revalidatePath("/teacher/courses/");
  } catch (error) {
    console.log("[DeletAcourse]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};
export const unpublishCourseAction = async (course: Course) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("you are not authenticated");
    }
    const FindCourse = await prisma.course.findUnique({
      where: {
        id: course.id,
        userId: user?.id,
      },
    });

    if (!FindCourse) {
      throw new Error("unauthorized to perform this action");
    }

    await prisma.course.update({
      where: {
        id: course.id,
      },
      data: {
        isPublished: false,
      },
    });
    revalidatePath("/teacher/courses/");
  } catch (error) {
    console.log("[DeletAcourse]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};

// ##################  cahpters

export const CreateAchapters = async (
  data: Partial<Chapters>,
  courseId: string
) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("you are not authenticated");
    }

    const lastChpters = await prisma.chapters.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    await prisma.chapters.create({
      data: {
        title: data.title!,
        courseId: courseId,
        position: lastChpters ? lastChpters.position + 1 : 1,
      },
    });

    revalidatePath("/teacher/courses/");
  } catch (error) {
    console.log("[Creatcahpter]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};

export const reorderAction = async (
  data: { id: string; position: number }[],
  courseId: string
) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("you are not authenticated");
    }
    const owner = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: user?.id,
      },
    });
    if (!owner) {
      throw new Error("unauthorized to perform this action");
    }

    data.forEach(async (item) => {
      await prisma.chapters.update({
        where: {
          courseId: courseId,
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    });

    revalidatePath("/teacher/courses/");
  } catch (error) {
    console.log("[Creatcahpter]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};

export const updateChapterAction = async (
  data: Partial<Chapters>,
  chapterid: string,
  courseid: string
) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("you are not authenticated");
    }
    const owner = await prisma.course.findUnique({
      where: {
        id: courseid,
        userId: user?.id,
      },
    });
    if (!owner) {
      throw new Error("unauthorized to perform this action");
    }

    await prisma.chapters.update({
      where: {
        id: chapterid,
        courseId: courseid,
      },
      data: {
        ...data,
      },
    });

    revalidatePath(`/teacher/courses/${courseid}/chapters`);
  } catch (error) {
    console.log("[Creatcahpter]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};

export const DeleteChapterAction = async (chapi: string, courseId: string) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("you are not authenticated");
    }
    const owner = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: user?.id,
      },
    });
    if (!owner) {
      throw new Error("unauthorized to perform this action");
    }

    const FindChapter = await prisma.chapters.findFirst({
      where: {
        id: chapi,
        courseId: courseId,
      },
    });
    if (!FindChapter) {
      throw new Error("chapter not found");
    }
    const DeleteChpter = await prisma.chapters.delete({
      where: {
        id: chapi,
        courseId: courseId,
      },
    });
    if (DeleteChpter) {
      const publishedChapters = await prisma.chapters.findMany({
        where: {
          courseId: courseId,
          isPublished: true,
        },
      });
      if (publishedChapters.length == 0)
        await prisma.course.update({
          where: {
            id: courseId,
          },
          data: {
            isPublished: false,
          },
        });
    }
    revalidatePath(`/teacher/courses/${courseId}`);
  } catch (error) {
    console.log("[DeleteChapter]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};

export const PublishChapter = async (chapter: Chapters) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("you are not authenticated");
    }
    const owner = await prisma.course.findUnique({
      where: {
        id: chapter.courseId!,
        userId: user?.id,
      },
    });
    if (!owner) {
      throw new Error("unauthorized to perform this action");
    }

    if (!chapter.title || !chapter.description || !chapter.videoUrl) {
      throw new Error("Please Fill all the req. fields");
    }
    await prisma.chapters.update({
      where: {
        id: chapter.id,
        courseId: chapter.courseId!,
      },
      data: {
        isPublished: true,
      },
    });
    revalidatePath(`/teacher/courses/${chapter.courseId}`);
  } catch (error) {
    console.log("[publishChapter]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};
export const UnPublishChapter = async (chapter: Chapters) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      throw new Error("you are not authenticated");
    }
    const owner = await prisma.course.findUnique({
      where: {
        id: chapter.courseId!,
        userId: user?.id,
      },
    });
    if (!owner) {
      throw new Error("unauthorized to perform this action");
    }

    const res = await prisma.chapters.update({
      where: {
        id: chapter.id,
        courseId: chapter.courseId!,
      },
      data: {
        isPublished: false,
      },
    });
    if (res) {
      const publishedChapters = await prisma.chapters.findMany({
        where: {
          courseId: chapter.courseId,
          isPublished: true,
        },
      });
      if (publishedChapters.length === 0)
        await prisma.course.update({
          where: {
            id: chapter.courseId!,
          },
          data: {
            isPublished: false,
          },
        });
    }

    revalidatePath(`/teacher/courses/${chapter.courseId}`);
  } catch (error) {
    console.log("[unpublishChapter]", error);
    if (error instanceof Error) {
      return { error: `${error.message}` };
    } else {
      return { error: "internal server Error" };
    }
  }
};

export const getChapterinfo = async (
  userId: string,
  chapterId: string,
  courseId: string
) => {
  try {
    const ccourse = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        Price: true,
        chapters:{
          select:{
            userProgress:{
              where:{
                userId:userId
              }
            }
          }
        }
      },
    });
    const chapter = await prisma.chapters.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter && !ccourse) {
      throw new Error("chapter or course not found");
    }

    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
    });
    let Attachments: Attachments[] = [];
    let NextChapter: Chapters | null = null;
    if (purchase) {
      Attachments = await prisma.attachments.findMany({
        where: {
          courseId: courseId,
        },
      });
    }
    if (purchase || chapter?.isFree) {
      NextChapter = await prisma.chapters.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    const userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId: userId,
          chapterId: chapterId,
        },
      },
    });

    const isLocked = !purchase && !chapter?.isFree;
    return {
      course: ccourse,
      chapter: chapter,
      isLocked:isLocked,
      Attachments: Attachments,
      NextChapter: NextChapter,
      userProgress: userProgress,
      purchase:purchase
    };

  } catch (error) {
    console.log("[getChapterinfo]", error);
    return {
      course: null,
      chapter: null,
      isLocked: false,
      Attachments: [],
      NextChapter: null,
      userProgress: null,
      purchase : null
    };
  }
};
