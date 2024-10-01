"use client"

import { category } from "@prisma/client";

interface catprops {
  items: category[];
}
import {
  FcMultipleDevices,
  FcEngineering,
  FcFilmReel,
  FcBarChart,
  FcLock,
  FcMultipleSmartphones,
} from "react-icons/fc";
import { IconType } from "react-icons";
import CategoryITems from "./CategoryITems";
import SearchInput from "@/app/(dashboard)/_components/SearchInput";

const iconmaps: Record<category["name"], IconType> = {
  "Web Development": FcMultipleDevices,
  "Mobile Development": FcMultipleSmartphones,
  "Data Science": FcBarChart,
  "Cyber Security": FcLock,
  "Computer Science": FcEngineering,
  Filming: FcFilmReel,
};
const Categories = ({ items }: catprops) => {
  return (
    <>
    <div className=" mt-20  ">
    <div className="md:hidden flex w-full   " >
       <SearchInput/>
    </div>
      <div className=" mx-4 my-4  flex gap-x-2  pb-2  overflow-x-auto scrollbar-thin  scrollbar-thumb-sky-500/25 scrollbar-track-gray-200 " >
        {items.map((item) => {
            const icon = iconmaps[item.name];
            return (
                <CategoryITems
                key={item.id}
                id={item.id}
                icon={icon}
                title={item.name}
                />
            );
        })}
      </div>
    </div>
        </>
  );
};

export default Categories;
