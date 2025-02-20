import { useQuery } from "@tanstack/react-query";
import { Chemical } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Beaker } from "lucide-react";

export default function ChemicalsPage() {
  const { data: chemicals, isLoading } = useQuery<Chemical[]>({
    queryKey: ["/api/chemicals"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <Beaker className="h-8 w-8" />
        <h1 className="text-3xl font-bold">药水 Chemicals</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chemicals?.map((chemical) => (
          <Card key={chemical.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{chemical.nameEn}</CardTitle>
                  <CardDescription>{chemical.nameZh}</CardDescription>
                </div>
                <Badge>{chemical.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>制造商 Manufacturer:</strong> {chemical.manufacturer}</p>
                <p><strong>稀释比例 Dilution Ratio:</strong> {chemical.dilutionRatio}</p>
                <p><strong>温度范围 Temperature Range:</strong> {chemical.temperatureRange}</p>
                <p><strong>保质期 Shelf Life:</strong> {chemical.shelfLife}</p>
                <div className="mt-4">
                  <p className="text-sm">{chemical.descriptionEn}</p>
                  <p className="text-sm text-muted-foreground">{chemical.descriptionZh}</p>
                </div>
                <div className="mt-4 p-3 bg-destructive/10 rounded-md">
                  <p className="text-sm font-medium mb-1">安全须知 Safety Notes:</p>
                  <p className="text-sm">{chemical.safetyNotesEn}</p>
                  <p className="text-sm text-muted-foreground">{chemical.safetyNotesZh}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!chemicals || chemicals.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            暂无药水数据 / No chemicals available
          </p>
        </div>
      )}
    </div>
  );
}
