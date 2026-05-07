const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-white/10 rounded-xl ${className}`} />
  );
};

export const PostSkeleton = () => (
  <div className="glass p-4 rounded-[32px] mb-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-20 h-3" />
      </div>
    </div>
    <Skeleton className="w-full aspect-square rounded-2xl" />
    <div className="space-y-2">
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-2/3 h-4" />
    </div>
  </div>
);

export default Skeleton;
