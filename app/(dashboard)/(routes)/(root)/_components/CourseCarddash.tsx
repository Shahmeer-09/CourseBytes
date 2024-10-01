import { IconCustom } from "@/components/icon-custom";
import ProgressCom from "@/components/ProgressCom";
import { formatPrice } from "@/lib/PriceFormat";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface courscardprops {
  id: string;
  title: string;
  price: number;
  imageurl: string;
  category: string;
  chapterslength: number;
  progress: number;
}
const CourseCard = ({
  id,
  title,
  price,
  category,
  imageurl,
  chapterslength,
  progress,
}: courscardprops) => {

  return (
    <Link href={`/courses/${id}`} >
      <div className=" flex flex-col group gap-2 hover:shadow-md transition p-2 rounded-md  ">
        <div className=" relative aspect-video rounded-md   ">
          <Image
            src={imageurl.toString()}
            alt={title}
            fill
            className=" rounded-md object-cover "
          />
        </div>
        <div className=" flex flex-col gap-1">
          <div className=" group-hover:text-sky-800  md:text-sm text-base font-semibold  line-clamp-1 ">
            {title}
          </div>
          <p className="  text-muted-foreground text-xs  ">{category}</p>
          <div className=" flex items-center mt-2 ">
            <div className=" flex items-center gap-x-2 ">
              <IconCustom icon={BookOpen} size={"sm"} />
              {chapterslength}
              <span className="text-xs text-muted-foreground">
                {chapterslength === 1 ? "chatper" : "chapters"}
              </span>
            </div>
          </div>
          <span>
            {progress ? (
              <>
              <ProgressCom value={progress} variant="default" />
              </>
            ) : (
              <span className=" text-base md:text-sm font-semibold">
                {formatPrice(price)}
              </span>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
