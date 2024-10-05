"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import qs from "query-string";
import React, { useCallback } from "react";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { debounce } from "throttle-debounce";
const SearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const catid = searchParams.get("categoryId");
  const [value, setvalue] = useState("");
  const setStrinf = (val: string) => {
    const route = qs.stringifyUrl({
      url: pathname,
      query: {
        categoryId: catid,
        title: val,
      },
    });
    router.push(route);
  };
  const debouncedfun = useCallback(debounce(1000,(value) => setStrinf(value)), [setvalue]);

  const searchstart = !!pathname.startsWith("/search");
  return (
    <>
      {searchstart && (
        <div className=" relative md:w-[300px] w-full  mx-3 md:mx-0">
          <Search className="absolute top-3 left-3 h-4 w-4 " />
          <Input
            value={value}
            onChange={(e) => {
              setvalue(e.target.value);
              debouncedfun(e.target.value);
            }}
            placeholder="search for course"
            className=" f rounded-3xl pl-9 w-full   bg-slate-100 focus-visible:ring-slate-200  "
          />
        </div>
      )}
      {!searchstart && (
        <div className=" relative md:w-[300px] w-full  mx-3 md:mx-0"></div>
      )}
    </>
  );
};

export default SearchInput;
