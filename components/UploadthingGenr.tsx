import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

interface props {
  endpoint: keyof typeof ourFileRouter;
  onchnage: (url: string) => void;
}

const UploadthingGenr = ({ endpoint, onchnage }: props) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onchnage(res[0].url);
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error.message}`);
      }}
    />
  );
};

export default UploadthingGenr;
