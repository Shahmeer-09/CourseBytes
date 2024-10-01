import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const header = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(
      body,
      header,
      process.env.WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new Response(`webhook Error ${error.message} `, { status: 400 });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const courseid = session.metadata?.courseId;
  const userid = session.metadata?.userId;

  switch (event.type) {
    case "checkout.session.completed":
      await prisma.purchase.create({
        data: {
          courseId: courseid!,
          userId: userid!,
        },
      });
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  return new Response(null, { status: 200 });
}
