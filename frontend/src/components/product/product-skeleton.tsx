import { Skeleton } from "@/components/ui/skeleton";

export default function ProductTabsSkeleton() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-lg border p-3">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full rounded-md mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}