"use client";
import { Loader2, Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";

interface vidprops {
  chapterid: string;
  courseid: string;
  islocked: boolean;
  nextchapterid: string;
  onvedioended: boolean;
  title: string;
  videoUrl: string;
}

const Videoplayer = ({
  chapterid,
  courseid,
  islocked,
  onvedioended,
  title,
  nextchapterid,
  videoUrl,
}: vidprops) => {
  const [ready, setisReady] = useState(false);
  useEffect(() => {
    setisReady(true);
  }, [setisReady]);
  return (
    <div className="relative aspect-video ">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-slate-100" />
        </div>
      )}
      {islocked && (
        <div className=" flex absolute inset-0  justify-center items-center bg-slate-800 ">
          <div className="flex flex-col items-center gap-y-3 ">
            <Lock className="h-8 w-8 text-slate-100 " />
            <span className="text-muted-foreground text-sm ">
              {" "}
              This chapter is locked, you must purchase it to watch its content
            </span>
          </div>
        </div>
      )}
      {ready && !islocked && (
        <ReactPlayer
          url={videoUrl}
          controls
          height={"100%"}
          width={"100%"}

        />
      )}
    </div>
  );
};

export default Videoplayer;
