"use client";

import React from "react";
import UserDropdown from "./UserDropdown";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ghost, LogOut } from "lucide-react";
interface userbtnprops {
  name: string;
  email: string;
  image: string;
  isadmin: boolean;
}
const Userbtn = ({ name, email, image, isadmin }: userbtnprops) => {
  const pathname = usePathname();
  const isTeacher = pathname.includes("/teacher");
  const isCourseCard = pathname.includes("/courses");

  return (
    <div className=" flex gap-x-2 mr-3  ">
      {isTeacher || isCourseCard ? (
        <Button variant={"ghost"} size={"sm"} asChild>
          <Link href={"/"}>
            <LogOut className=" h-4 w-4 mr-2" />
            Exit
          </Link>
        </Button>
      ) : (
        <>
          {isadmin && (
            <Button variant={"ghost"} size={"sm"} asChild>
              <Link href={"/teacher/courses"}>Teacher mode</Link>
            </Button>
          )}
        </>
      )}
      <UserDropdown name={name} email={email} image={image} />
    </div>
  );
};

export default Userbtn;
