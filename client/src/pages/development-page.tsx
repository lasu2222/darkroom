import { useQuery } from "@tanstack/react-query";
import { DevelopmentProcess, Film, Chemical } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TestTubes, Clock, Thermometer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DevelopmentPage() {
  const { data: processes, isLoading: processesLoading } = useQuery<DevelopmentProcess[]>({
    queryKey: ["/api/processes"],
  });

  const { data: films, isLoading: filmsLoading } = useQuery<Film[]>({
    queryKey: ["/api/films"],
  });

  const { data: chemicals, isLoading: chemicalsLoading } = useQuery<Chemical[]>({
    queryKey: ["/api/chemicals"],
  });

  const isLoading = processesLoading || filmsLoading || chemicalsLoading;

  const getFilmName = (filmId: number) => {
    const film = films?.find(f => f.id === filmId);
    return film ? `${film.nameEn} (${film.nameZh})` : '';
  };

  const getChemicalName = (chemicalId: number) => {
    const chemical = chemicals?.find(c => c.id === chemicalId);
    return chemical ? `${chemical.nameEn} (${chemical.nameZh})` : '';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <TestTubes className="h-8 w-8" />
        <h1 className="text-3xl font-bold">冲洗指南 Development Guide</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>胶片 Film</TableHead>
                <TableHead>显影剂 Developer</TableHead>
                <TableHead>稀释比例 Dilution</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>时间 Time (min)</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4" />
                    <span>温度 Temp (°C)</span>
                  </div>
                </TableHead>
                <TableHead>搅拌方式 Agitation</TableHead>
                <TableHead>备注 Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes?.map((process) => (
                <TableRow key={process.id}>
                  <TableCell>{getFilmName(process.filmId)}</TableCell>
                  <TableCell>{getChemicalName(process.chemicalId)}</TableCell>
                  <TableCell>{process.dilutionRatio}</TableCell>
                  <TableCell>{process.duration}</TableCell>
                  <TableCell>{process.temperature}</TableCell>
                  <TableCell className="max-w-[200px]">{process.agitationPattern}</TableCell>
                  <TableCell>
                    <p>{process.notesEn}</p>
                    <p className="text-muted-foreground">{process.notesZh}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {(!processes || processes.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            暂无冲洗指南数据 / No development processes available
          </p>
        </div>
      )}
    </div>
  );
}
