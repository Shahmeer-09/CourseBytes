import { IconCustom } from "@/components/icon-custom";
import { LucideIcon } from "lucide-react";
import React from "react";

interface infobarprops {
  length: number;
  icon: LucideIcon;
  variant?: "default" | "sm";
  label: string;
}

const InfoBar = ({ icon: Icon, length, variant, label }: infobarprops) => {
  return (
    <div className=" flex sm:justify-start px-6 py-4  w-full gap-x-2 ">
      <IconCustom icon={Icon} size={variant ?? "default"} />
      <div className=" flex flex-col  items-start  ">
        <p className=" font-medium ">{label} </p>
        <span className=" text-muted-foreground "> {length} courses </span>
      </div>
    </div>
  );
};

export default InfoBar;
