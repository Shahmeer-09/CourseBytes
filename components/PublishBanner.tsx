import { cva, VariantProps } from "class-variance-authority";
import { CheckCircle, LucideFileWarning } from "lucide-react";

const bannerVariants = cva("flex gap-x-2 my-2  items-center  w-full  px-4 py-2   ", {
  variants: {
    variant: {
      warning: "bg-yellow-500/45 text-zinc-800",
      success: "bg-green-500/45 text-white",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
});

interface bannerprops extends VariantProps<typeof bannerVariants> {
  label: string;
}
const Iconmap = {
  warning: LucideFileWarning,
  success: CheckCircle,
};
 export const Banner = ({ variant, label }: bannerprops) => {
  const Icon = Iconmap[variant || "warning"];
  return (
    <div className={bannerVariants({variant})}>
      <Icon />
      {label}
    </div>
  );
};
