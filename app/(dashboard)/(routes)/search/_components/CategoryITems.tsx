"use client"

import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { IconType } from "react-icons";
import qs from "query-string";
interface catitemprops {
  title?: string;
  id?: string;
  icon: IconType;
}
const CategoryITems = ({ title, id, icon: Icon }: catitemprops) => {
  const router = useRouter();
  const path = usePathname();

  const searchparams = useSearchParams();
  const catid = searchparams.get("categoryId");
  const name = searchparams.get("title");
  const isActive = catid === id;

  const onClick = () => {
    const parasm = qs.stringifyUrl(
      {
        url: path,
        query: {
          title: name,
          categoryId: isActive ? null : id,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(parasm);
  };
  return (
    <Button
      onClick={onClick}
      type="button"
      className={` flex items-center border justify-center rounded-2xl  gap-x-2 px-3 py-2 transition  ${
        isActive
          ? " text-blue-700 bg-slate-200 border-blue-400 hover:bg-slate-300 "
          : "text-slate-800 border-blue-300 bg-sky-100/25 hover:bg-sky-100 "
      } `}
    >
        <Icon className="h-4 w-4 "/>
        <p className=" text-xs " >{title}</p>
      
    </Button>
  );
};

export default CategoryITems;
