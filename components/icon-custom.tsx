import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const backgroundVariants = cva(
  " flex items-center justify-ceter rounded-full ",
  {
    variants: {
      variant: {
        default: "bg-sky-100",
        success: "bg-emerald-100",
      },
      size: {
        default: "p-2",
        sm: "p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
const iconVariants = cva(
  "",

  {
    variants: {
      variant: {
        default: " text-sky-700",
        success: "text-emerald-700",
      },
      size: {
        default: "h-8 w-8",
        sm: "h-4 w-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type IconProps = VariantProps<typeof iconVariants>;
type BackgroundProps = VariantProps<typeof backgroundVariants>;
interface IconCustomProps extends IconProps, BackgroundProps {
  icon: LucideIcon;
}

export const IconCustom = ({ icon: Icon, variant, size }: IconCustomProps) => {
  return (
    <div className={backgroundVariants({ variant, size })}>
      <Icon className={iconVariants({ variant, size })} />
    </div>
  );
};
