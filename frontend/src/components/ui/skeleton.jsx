// components/ui/skeleton.jsx
import { cn } from "@/lib/utils";

const Skeleton = ({ 
  className, 
  width, 
  height,
  ...props 
}) => (
  <div
    className={cn(
      "animate-pulse rounded-md bg-gray-200",
      className
    )}
    style={{ 
      width: width ? `${width}px` : '100%',
      height: height ? `${height}px` : 'auto',
      aspectRatio: width && height ? undefined : 'unset'
    }}
    {...props}
  />
);

export { Skeleton };