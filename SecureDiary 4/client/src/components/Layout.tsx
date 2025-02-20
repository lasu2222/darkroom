import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useState } from "react";
import { Scale, FileSpreadsheet, Beaker, TestTubes, LogIn, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [language, setLanguage] = useState<"en" | "zh">("en");
  const { user, logoutMutation } = useAuth();

  const navigation = [
    {
      en: { title: "Push/Pull", href: "/" },
      zh: { title: "推拉冲洗", href: "/" },
      icon: Scale
    },
    {
      en: { title: "Films", href: "/films" },
      zh: { title: "胶片", href: "/films" },
      icon: FileSpreadsheet
    },
    {
      en: { title: "Chemicals", href: "/chemicals" },
      zh: { title: "药水", href: "/chemicals" },
      icon: Beaker
    },
    {
      en: { title: "Development", href: "/development" },
      zh: { title: "冲洗", href: "/development" },
      icon: TestTubes
    },
    {
      en: { title: "About", href: "/about" },
      zh: { title: "关于", href: "/about" },
      icon: User
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold">
                {language === "en" ? "Xinlong Darkroom" : "新龙暗房"}
              </h1>
            </Link>

            <div className="flex items-center gap-4">
              <NavigationMenu>
                <NavigationMenuList>
                  {navigation.map((item) => (
                    <NavigationMenuItem key={item[language].href}>
                      <Link href={item[language].href}>
                        <NavigationMenuLink 
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md transition-colors",
                            location === item[language].href && "bg-accent"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item[language].title}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              <button
                onClick={() => setLanguage(lang => lang === "en" ? "zh" : "en")}
                className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
              >
                {language === "en" ? "中文" : "English"}
              </button>

              {user ? (
                <Button variant="outline" onClick={() => logoutMutation.mutate()}>
                  {user.username}
                </Button>
              ) : (
                <Link href="/auth">
                  <Button variant="outline" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    {language === "en" ? "Login" : "登录"}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}