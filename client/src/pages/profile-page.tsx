import { ChevronDown, ExternalLink, Camera } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const exhibitions = [
  {
    year: "2023",
    title: "Off Prints at Tate Morden Turbine Hall",
    location: "London",
  },
  {
    year: "2022",
    title: "Group Exhibition Pull Over and Take a Cig",
    location: "London",
  },
  {
    year: "2022",
    title: "Interdisciplinary Online Exhibition",
    location: "Carbon Borders Voices",
  },
  {
    year: "2022",
    title: "Work in Progress 2022",
    location: "Royal College of Art",
  },
  {
    year: "2021",
    title: "Art Exhibition",
    location: "Worcester University",
  },
];

export default function ProfilePage() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Bio Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">简介 Bio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">
              林鑫龙
              <span className="block text-xl mt-2 font-normal">
                Xinlong Lin
              </span>
            </h1>
            <a
              href="https://xinlonglin.info"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg text-primary hover:text-primary/80 transition-colors"
            >
              xinlonglin.info
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <p className="text-lg leading-relaxed">
            林鑫龙（生于 1998 年）是一位在伦敦工作和生活的中国摄影师。
            他于 2021 年在长春光华大学完成了学士学位。他的实践探索摄影与现实之间的关系。
            他使用舞台摄影和直接摄影来表达他一直在观察的生活状态。
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Xinlong Lin (b. 1998) is a Chinese photographer working and living in London.
            He completed his BA at Changchun Guanghua University in 2021.
            His practice explores the relations between photography and reality.
            He uses both staged photography and straight photography to express
            the state of life which he has been viewing.
          </p>
        </CardContent>
      </Card>

      {/* Featured Project Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Camera className="h-6 w-6 text-primary" />
            Featured Project
          </CardTitle>
          <CardDescription>Latest photographic exploration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <a
              href="https://xinlonglin.info/Beyond-Orientalism-Blooms-on-the-Shoreline"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img
                  src="/attached_assets/image_1739958404444.png"
                  alt="Beyond Orientalism Blooms on the Shoreline"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Beyond Orientalism: Blooms on the Shoreline
                  </h3>
                  <p className="text-white/80">
                    An exploration of cultural identity and representation through photography
                  </p>
                  <Button
                    variant="link"
                    className="text-white mt-4 p-0 hover:text-primary transition-colors"
                  >
                    View Project <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">教育 Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              摄影 MA Photography
            </h3>
            <p className="text-primary">Royal College of Art</p>
            <p className="text-muted-foreground">2021 - 2023</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              新闻学 BA Journalism
            </h3>
            <p className="text-primary">长春光华学院 Changchun Guanghua University</p>
            <p className="text-muted-foreground">2017 - 2021</p>
          </div>
        </CardContent>
      </Card>

      {/* Exhibitions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">精选展览 Selected Exhibitions</CardTitle>
          <CardDescription>Recent exhibitions and showcases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {exhibitions.slice(0, showMore ? undefined : 3).map((exhibition, index) => (
              <div key={index} className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">{exhibition.title}</h3>
                  <p className="text-primary">{exhibition.location}</p>
                </div>
                <span className="text-muted-foreground">{exhibition.year}</span>
              </div>
            ))}
            {exhibitions.length > 3 && (
              <Button
                variant="ghost"
                className="w-full hover:bg-primary/10 transition-colors"
                onClick={() => setShowMore(!showMore)}
              >
                <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${showMore ? 'rotate-180' : ''}`} />
                {showMore ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}