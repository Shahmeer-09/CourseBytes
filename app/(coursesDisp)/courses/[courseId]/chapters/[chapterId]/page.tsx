import { getChapterinfo } from "@/app/services/TeacherAction";
import { Banner } from "@/components/PublishBanner";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import Videoplayer from "./_components/Videoplayer";
import Purchasebtn from "./_components/Purchasebtn";
import { Separator } from "@/components/ui/separator";
import { View } from "@/components/Quilview";
import Link from "next/link";
import { File } from "lucide-react";
import { ChapterProgressBtn } from "./_components/ChapterProgressBtn";


const page = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user.id) {
    return redirect("/");
  }
  const {
    course,
    chapter,
    isLocked,
    Attachments,
    NextChapter,
    userProgress,
    purchase,
  } = await getChapterinfo(user?.id, params.chapterId, params.courseId);
  if (!course || !chapter) {
    return redirect("/");
  }
  const onvedioEnded = !!purchase && !userProgress?.isCompleted;

  return (
    <>
      {isLocked && (
        <Banner
          label="This Chapter is not free you must buy it to see the content..."
          variant={"warning"}
        />
      )}
      {userProgress?.isCompleted && (
        <Banner
          variant={"success"}
          label="You have already completed this chapter"
        />
      )}
      <div className=" flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <Videoplayer
            chapterid={params.chapterId}
            courseid={params.courseId}
            islocked={isLocked}
            onvedioended={onvedioEnded}
            nextchapterid={NextChapter?.id.toString()!}
            title={chapter.title}
            videoUrl={chapter.videoUrl!}
          />
        </div>
        <div>
          <div className=" flex flex-col md:flex-row md:justify-between items-center gap-y-4  p-4  ">
            <h2 className="font-bold md:text-2xl text-lg ">{chapter.title}</h2>
            {!!purchase ? (
                <ChapterProgressBtn
                  chapid={params.chapterId}
                  course={course}
                  iscompleted={!!userProgress?.isCompleted}
                  nextchapterid={NextChapter?.id!}
                />
            ) : (
              <Purchasebtn courseid={params.courseId} pirce={course.Price!} />
            )}
          </div>
          <Separator />
          <div className="flex items-center md:justify-start justify-center  ">
            <View
              value={chapter.description!}
              fontsize="38px"
              fontweight="600"
            />
          </div>
          {!!Attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {Attachments.map((attachment) => (
                  <Link
                    key={attachment.id}
                    target="_blank"
                    className="flex items-center gap-x-2 p-3 rounded-md border border-sky-800/40  bg-sky-300/40 hover:bg-sky-200/55 "
                    href={attachment.url}
                  >
                    <File />
                    <p className=" line-clamp-1">{attachment.name}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default page;
