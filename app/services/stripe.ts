"use server"

import { prisma } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/Stripe";
import Stripe from "stripe";

export const createOrder = async (courseId: string) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user || !user.id || !user?.email) {
      return { error: "unauthorized" }
    }
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return { error: "course not found" }
    }
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });
    if (purchase) {
      return { error: "you have already purchased this course" }
       
    
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.Price! * 100),
        },
        quantity: 1,
      },
    ];

    const stripeCustomerid = await prisma.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });
    if (!stripeCustomerid) {
      const stripecustomer = await stripe.customers.create({
        email: user.email,
      });
      await prisma.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: stripecustomer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerid?.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=1`,
      metadata: {
        courseId: courseId,
        userId: user.id,
      },
    });
    return { url: session.url }
  } catch (error) {
    return { error: "internal server Error" }
  }
};
