"use server";


import { prisma } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

export const progressUpdate = async (chapid: string, progress: boolean, courseid:string) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }
  await prisma.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId: user.id,
          chapterId: chapid,
        },
      },
      create: {
        userId: user.id,
        chapterId: chapid,
        isCompleted: progress,
      },
      update: {
        isCompleted: progress,
      },
    });
    const chaptercompleted = await prisma.chapters.findMany({
      where:{
        courseId:courseid,
        isPublished:true
      },
       include:{
        userProgress:{
          where:{
            userId:user.id
          }
        }
       }
    })

    const allchapterWatched = chaptercompleted.every(chap=> chap.userProgress?.[0].isCompleted)
    console.log(allchapterWatched);
    revalidatePath(`/courses`);
    return {completed:allchapterWatched  };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Internal Server Error" };
    }
  }
};
