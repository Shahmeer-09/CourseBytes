
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();
const handleauth = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    throw new UploadThingError("unauthorized");
  }
  return { userId: user.id };
};
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleauth())
    .onUploadComplete(async ({}) => {}),
  attachmentFile: f(["text", "image", "video", "pdf", "audio"])
    .middleware(handleauth)
    .onUploadComplete(async ({}) => {}),
  chapterVids: f({ video: { maxFileSize:"16GB", maxFileCount: 1 } })
    .middleware(() => handleauth())
    .onUploadComplete(({}) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
