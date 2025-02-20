import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DiaryEntry } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, LogOut, Plus, Save, Trash } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  const { data: entries, isLoading } = useQuery<DiaryEntry[]>({
    queryKey: ["/api/entries"],
  });

  const createEntryMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/entries", { content });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: "Entry Created",
        description: "Your diary entry has been saved.",
      });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const res = await apiRequest("PATCH", `/api/entries/${id}`, { content });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: "Entry Updated",
        description: "Your diary entry has been updated.",
      });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: "Entry Deleted",
        description: "Your diary entry has been deleted.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedEntry = entries?.find(
    (entry) => format(new Date(entry.date), "yyyy-MM-dd") === selectedDate
  );

  const dates = entries?.map((entry) =>
    format(new Date(entry.date), "yyyy-MM-dd")
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Personal Diary</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.username}</p>
          </div>
          <Button variant="ghost" onClick={() => logoutMutation.mutate()}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {dates?.includes(selectedDate) ? (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          if (selectedEntry) {
                            deleteEntryMutation.mutate(selectedEntry.id);
                          }
                        }}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Entry
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => {
                          createEntryMutation.mutate("");
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Entry
                      </Button>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {format(new Date(selectedDate), "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Write your thoughts..."
                  className="min-h-[400px]"
                  value={selectedEntry?.content || ""}
                  onChange={(e) => {
                    if (selectedEntry) {
                      updateEntryMutation.mutate({
                        id: selectedEntry.id,
                        content: e.target.value,
                      });
                    }
                  }}
                />
                {selectedEntry && (
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Auto-saving...
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
