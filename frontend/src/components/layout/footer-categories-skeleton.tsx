import { Skeleton } from "@/components/ui/skeleton";

export function FooterCategoriesSkeleton() {
  return (
    <div>
      <Skeleton className="mb-4 h-4 w-24" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
