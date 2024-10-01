"use server";

import { prisma } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export const getAnalytics = async () => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      return redirect("/");
    }

    const groupedCourses = await prisma.purchase.findMany({
      where: {
        course: {
          userId: user.id,
        },
      },
      include: {
        course: {
          select: {
            title: true,
            Price: true,
          },
        },
      },
    });

    const res = groupedCourses.reduce(
      (acc: { [key: string]: number }, curr) => {
        const title = curr.course?.title;
        const price = curr.course?.Price!;

        if (title) {
          if (acc[title]) {
            acc[title] += price;
          } else {
            acc[title] = price;
          }
        }

        return acc;
      },
      {}
    );
    const data = Object.entries(res).map(([title, revenue]) => ({
      name: title,
      total: revenue,
    }));
    const totalRevenue = Object.values(res).reduce(
      (acc: number, curr: number) => acc + curr,
      0
    );
    const totlaSales = groupedCourses.length;
    console.log(totalRevenue)
    return { data, totalRevenue, totlaSales };
  } catch (error) {
    return { error };
  }
};
