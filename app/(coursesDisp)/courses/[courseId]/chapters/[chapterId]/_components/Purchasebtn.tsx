"use client";

import { createOrder } from "@/app/services/stripe";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/PriceFormat";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
interface purchaseprops {
  courseid: string;
  pirce: number;
}
const Purchasebtn = ({ courseid, pirce }: purchaseprops) => {
  const [loading, setisloading] = useState(false);
  const router = useRouter()
  const onClick = async () => {
    try {
      setisloading(true);
      const res = await createOrder(courseid);
      if (res?.error) {
        toast.error(res?.error);
      }
      router.push(res?.url as string);
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setisloading(false);
    }
  };
  return (
    <>
      <Button disabled={loading} onClick={onClick} className="w-full md:w-auto">
        Enroll for {formatPrice(pirce)}
      </Button>
    </>
  );
};

export default Purchasebtn;
