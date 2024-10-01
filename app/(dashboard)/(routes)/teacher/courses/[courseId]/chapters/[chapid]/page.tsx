import { IconCustom } from "@/components/icon-custom";
import { prisma } from "@/lib/db";
import { ArrowLeftIcon, Eye, LayoutDashboard, VideoIcon } from "lucide-react";

import Link from "next/link";
import { redirect } from "next/navigation";
import ChapTitleForm from "./_components/ChapTitleForm";
import ChapterDescForm from "./_components/ChapterDescForm";
import AccessChapterForm from "./_components/AccessChapterForm";
import ChapterVideUpload from "./_components/ChapterVideUpload";
import { unstable_noStore as noStore } from "next/cache";
import { Banner } from "@/components/PublishBanner";
import ChapterActions from "./_components/ChapterActions";
const getChapter = async (chapid: string, courseid: string) => {
  const chap = await prisma.chapters.findUnique({
    where: {
      id: chapid,
      courseId: courseid,
    },

  });
  return chap;
};
const page = async ({
  params,
}: {
  params: { courseId: string; chapid: string };
}) => {
  noStore();
  const chapter = await getChapter(params.chapid, params.courseId);
  if (!chapter) {
    return redirect(`/teacher/courses/${params.courseId}`);
  }

  const requiredfilds = [chapter.title, chapter.description, chapter.videoUrl];

  const completef = requiredfilds.filter(Boolean).length;
  const totalf = requiredfilds.length;
  const progress = `(${completef}/${totalf})`;
  const iscomplete = !!requiredfilds.filter(Boolean);
  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant={"warning"}
          label="This chapter is unpublished . It will not be vsible in the course "
        />
      )}
      <div className=" p-6">
        <div className=" flex items-center justify-between gap-6 ">
          <div className=" w-full  ">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className=" flex items-center gap-x-2 cursor-pointer  "
            >
              <ArrowLeftIcon className=" h-4 w-4" />
              <h1 className=" font-medium">Go back to the course</h1>
            </Link>
            <div className=" flex items-center justify-between  " >
              <div className="mt-6">
                <h1 className=" font-semibold text-xl">Course chapter</h1>
                <span className=" text-sm  text-muted-foreground ">
                  Form progress {progress}
                </span>
              </div>
              <ChapterActions chapter={chapter} disabled={!iscomplete} />
            </div>
          </div>
        </div>

        <div className="  grid md:grid-cols-2 gap-x-6 mt-8 grid-cols-1 ">
          <div className=" space-y-6 ">
            <div className=" flex items-center gap-x-2 ">
              <IconCustom icon={LayoutDashboard} />
              <h2 className=" font-semibold text-lg ">
                Customize your chapters
              </h2>
            </div>
            <ChapTitleForm initialData={chapter} />
            <ChapterDescForm initialData={chapter} />
            <div>
              <div className=" flex items-center gap-x-2  ">
                <IconCustom icon={Eye} />
                <h1>Access settings</h1>
              </div>
              <AccessChapterForm initialData={chapter} />
            </div>
          </div>
          <div className=" space-y-6 ">
            <div>
              <div className=" flex items-center gap-x-2  ">
                <IconCustom icon={VideoIcon} />
                <h1>Upload Video</h1>
              </div>
              <ChapterVideUpload initialData={chapter} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
