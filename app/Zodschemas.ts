import { z } from "zod";

export const TitleSchema = z.object({
  title: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
});
export const DescSchema = z.object({
  description: z.string().min(4, {
    message: "description must be at least 4 characters.",
  }),
});
export const ImageUploadSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "no image provided.",
  }),
});
export const VideoUploadSchema = z.object({
  videoUrl: z.string().min(1)
});
export const CategorySchema = z.object({
  CategoryID: z.string().min(1),
});
export const PriceSchema = z.object({
  Price: z.coerce.number(),
});
export const AttachmentSchema = z.object({
  url: z.string().min(1, {
    message: "no File provided.",
  }),
});
export const chapterSchema = z.object({
  title: z.string().min(1,{
    message: "title must be at least 1 characters.",
  }),
});
export const AccessChapterSchema = z.object({
  isFree: z.boolean().default(false)
});
