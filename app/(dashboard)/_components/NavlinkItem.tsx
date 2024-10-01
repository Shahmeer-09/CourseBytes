"use client"

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';

interface itemprops {
  name: string;
  url: string;
  iconnav: LucideIcon;
}
const NavlinkItem = ({ name, url, iconnav: Icon }: itemprops) => {
  const pathname = usePathname();
  const isactive =
    pathname == url || pathname.startsWith(`${url}/`) || (pathname == "/" && url=="/") ;
  return (
    <div className='flex h-12 items-center  ' >
      <Button
        asChild
        variant={"ghost"}
        className={`${
          isactive
            ? " bg-blue-300/15  text-blue-900 hover:bg-blue-300/25 "
            : " text-zinc-800 bg-zinc-100 hover:bg-zinc-700/25 "
        }    justify-start px-6  transition-all  w-full `}
      >
        <Link href={url} className=" flex items-center gap-x-2 " >
          <Icon    className=" h- " />
          {name}
        </Link>
      </Button>
      <div className={` border-2 rounded-lg  border-blue-900 h-full ${isactive? "opacity-100":"opacity-0"} `} />
    </div>
  );
};

export default NavlinkItem;
