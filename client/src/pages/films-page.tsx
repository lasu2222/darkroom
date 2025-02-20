import { useQuery } from "@tanstack/react-query";
import { Film, DevelopmentProcess, Chemical } from "@shared/schema";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSpreadsheet, Clock, Thermometer, ShoppingCart, Info, Camera, Search, Sun, CloudSun, Moon, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FilmCategory = "B&W" | "Color" | "Slide";

export default function FilmsPage() {
  const [selectedCategory, setSelectedCategory] = useState<FilmCategory>("B&W");
  const [searchQuery, setSearchQuery] = useState("");
  const [showISOGuide, setShowISOGuide] = useState(false);

  const { data: films, isLoading: filmsLoading } = useQuery<Film[]>({
    queryKey: ["/api/films"],
  });

  const { data: processes, isLoading: processesLoading } = useQuery<DevelopmentProcess[]>({
    queryKey: ["/api/processes"],
  });

  const { data: chemicals, isLoading: chemicalsLoading } = useQuery<Chemical[]>({
    queryKey: ["/api/chemicals"],
  });

  const isLoading = filmsLoading || processesLoading || chemicalsLoading;

  const getChemicalName = (chemicalId: number) => {
    const chemical = chemicals?.find(c => c.id === chemicalId);
    return chemical ? `${chemical.nameEn} (${chemical.nameZh})` : '';
  };

  const getFilmProcesses = (filmId: number) => {
    return processes?.filter(p => p.filmId === filmId) || [];
  };

  const filteredFilms = films?.filter(film => {
    const matchesCategory = selectedCategory === film.type;

    if (!matchesCategory) return false;

    if (!searchQuery) return true;

    const searchTerms = searchQuery.toLowerCase();
    return (
      film.nameEn.toLowerCase().includes(searchTerms) ||
      film.nameZh.toLowerCase().includes(searchTerms) ||
      film.manufacturer.toLowerCase().includes(searchTerms) ||
      film.brand.toLowerCase().includes(searchTerms) ||
      film.iso.toString().includes(searchTerms)
    );
  });

  const filmUsageAdvice: Record<string, { en: string; zh: string; tips: string[] }> = {
    'Delta 100': {
      en: 'Ideal for landscape and studio photography where maximum detail is required.',
      zh: '适用于需要最大细节的风景和工作室摄影。',
      tips: [
        'Use a tripod for best sharpness',
        'Meter carefully - has less exposure latitude than higher ISO films',
        'Perfect for bright daylight conditions'
      ]
    },
    'Delta 400': {
      en: 'Versatile film suitable for general photography and low light situations.',
      zh: '多用途胶片，适用于一般摄影和低光环境。',
      tips: [
        'Can be pushed to ISO 800 or 1600',
        'Great for indoor and outdoor use',
        'Good for street photography'
      ]
    },
    'FP4+': {
      en: 'Classic medium-speed film with excellent tonal range.',
      zh: '经典中速胶片，具有出色的色调范围。',
      tips: [
        'Excellent for portraits',
        'Very forgiving in development',
        'Good for architecture photography'
      ]
    },
    'HP5+': {
      en: 'Highly versatile film that excels in most lighting conditions.',
      zh: '高度通用的胶片，在大多数光线条件下表现出色。',
      tips: [
        'Can be pushed to ISO 3200',
        'Perfect for documentary photography',
        'Great in changing light conditions'
      ]
    },
    'Tri-X 400': {
      en: 'Legendary film known for its distinctive grain structure.',
      zh: '传奇胶片，以其独特的颗粒结构著称。',
      tips: [
        'Classic photojournalism film',
        'Very pushable - up to ISO 6400',
        'Distinctive contrast and grain'
      ]
    },
    'T-Max 100': {
      en: 'Ultra-fine grain film for maximum sharpness and detail.',
      zh: '超细颗粒胶片，提供最大的锐度和细节。',
      tips: [
        'Excellent for large prints',
        'Best with precise exposure',
        'Ideal for product photography'
      ]
    },
    'Gold 200': {
      en: 'Versatile color negative film ideal for sunny conditions and everyday photography.',
      zh: '通用彩色负片，适合阳光充足的日常拍摄。',
      tips: [
        'Best shooting time: 2 hours after sunrise to 2 hours before sunset',
        'Great for outdoor landscapes and portraits',
        'Provides saturated colors and fine grain',
        'Ideal for sunny day photography'
      ]
    },
    'Portra 400': {
      en: 'Professional color negative film with exceptional exposure latitude and natural skin tones.',
      zh: '专业彩色负片，具有极高的宽容度和自然的肤色表现。',
      tips: [
        'Excellent for all types of portrait photography',
        'High exposure latitude - forgiving of exposure errors',
        'Natural and pleasing skin tones',
        'Works well in various lighting conditions',
        'Can be used indoors with available light'
      ]
    }
  };

  const getFilmExampleUrl = (filmName: string) => {
    return `https://placehold.co/600x400/gray/white/svg?text=${encodeURIComponent(filmName)}+Example`;
  };

  const getPurchaseLink = (filmName: string, region: 'global' | 'china') => {
    const links = {
      global: {
        'Delta 100': 'https://www.ilfordphoto.com/delta-100-professional-35mm',
        'Delta 400': 'https://www.ilfordphoto.com/delta-400-professional-35mm',
        'HP5+': 'https://www.ilfordphoto.com/hp5-plus-35mm',
        'FP4+': 'https://www.ilfordphoto.com/fp4-plus-35mm',
        'Tri-X 400': 'https://imaging.kodak.com/global/en/professional/products/films/tri-x-400/',
        'T-Max 100': 'https://imaging.kodak.com/global/en/professional/products/films/t-max-100/',
      },
      china: {
        'Delta 100': 'https://item.taobao.com/item.htm?id=xxx',
        'Delta 400': 'https://item.taobao.com/item.htm?id=xxx',
        'HP5+': 'https://item.taobao.com/item.htm?id=xxx',
        'FP4+': 'https://item.taobao.com/item.htm?id=xxx',
      }
    };
    return links[region]?.[filmName] || '#';
  };

  const ISOGuide = [
    {
      range: "低速胶片 Low Speed (ISO 25-100)",
      icon: Sun,
      characteristics: {
        en: "Fine grain, high sharpness, rich color saturation",
        zh: "颗粒细腻，图像清晰度高，色彩饱和度好"
      },
      conditions: {
        en: "Bright daylight, studio lighting, landscape photography",
        zh: "明亮的日光下，摄影棚灯光，风景摄影"
      },
      tips: {
        en: "Use a tripod for best results, perfect for detailed shots",
        zh: "建议使用三脚架以获得最佳效果，适合拍摄细节"
      }
    },
    {
      range: "中速胶片 Medium Speed (ISO 100-400)",
      icon: CloudSun,
      characteristics: {
        en: "Balanced grain and sharpness, good overall performance",
        zh: "颗粒适中，图像质量平衡"
      },
      conditions: {
        en: "Cloudy days, indoor lighting, versatile use",
        zh: "多云天气，室内光线，多用途场景"
      },
      tips: {
        en: "Great all-around choice for most shooting situations",
        zh: "适合大多数拍摄场景的通用选择"
      }
    },
    {
      range: "高速胶片 High Speed (ISO 400+)",
      icon: Moon,
      characteristics: {
        en: "More visible grain, high light sensitivity",
        zh: "颗粒较明显，对光线非常敏感"
      },
      conditions: {
        en: "Low light, indoor, night photography, fast action",
        zh: "低光环境，室内，夜景摄影，快速动作"
      },
      tips: {
        en: "Ideal for challenging lighting conditions and action shots",
        zh: "适合光线不足的环境和动态摄影"
      }
    }
  ];

  const handlePrint = (film: Film) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const processes = getFilmProcesses(film.id);
    const filmAdvice = filmUsageAdvice[film.nameEn];

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${film.nameEn} Development Guide</title>
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin: 20px 0; }
            .warning { color: #991b1b; }
            @media print {
              body { font-size: 12pt; }
              .no-break { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${film.nameEn} / ${film.nameZh}</h1>
            <p>Film Development Guide / 冲洗指南</p>
            <p>${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section no-break">
            <h2>Film Information / 胶片信息</h2>
            <table>
              <tr>
                <td><strong>Type / 类型:</strong></td>
                <td>${film.type}</td>
              </tr>
              <tr>
                <td><strong>ISO / 感光度:</strong></td>
                <td>${film.iso}</td>
              </tr>
              <tr>
                <td><strong>Manufacturer / 制造商:</strong></td>
                <td>${film.manufacturer}</td>
              </tr>
            </table>
          </div>

          ${filmAdvice ? `
          <div class="section no-break">
            <h2>Usage Advice / 使用建议</h2>
            <p>${filmAdvice.en}</p>
            <p>${filmAdvice.zh}</p>
            <ul>
              ${filmAdvice.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <div class="section no-break">
            <h2>Development Processes / 冲洗工艺</h2>
            ${film.type === 'Color' ? `
            <p class="warning">
              注意：C-41工艺温度控制关键，需严格保持38°C（±0.3°C）<br>
              Note: C-41 process temperature control is critical, maintain 38°C (±0.3°C)
            </p>
            ` : ''}
            <table>
              <thead>
                <tr>
                  <th>Developer / 显影剂</th>
                  <th>Dilution / 稀释比例</th>
                  <th>Time / 时间 (min)</th>
                  <th>Temp / 温度 (°C)</th>
                </tr>
              </thead>
              <tbody>
                ${processes.map(process => `
                  <tr>
                    <td>${getChemicalName(process.chemicalId)}</td>
                    <td>${process.dilutionRatio}</td>
                    <td>${process.duration}</td>
                    <td>${process.temperature}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <p><strong>Agitation Pattern / 搅拌方式:</strong><br>
            ${processes[0]?.agitationPattern || 'Standard agitation / 标准搅拌'}</p>

            <p><strong>Notes / 备注:</strong><br>
            ${processes[0]?.notesEn || ''}<br>
            ${processes[0]?.notesZh || ''}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
    };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="container mx-auto py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6"
      >
        <FileSpreadsheet className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          胶片 Films
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant="outline"
          onClick={() => setShowISOGuide(!showISOGuide)}
          className="mb-4 hover:bg-primary/10 transition-colors"
        >
          {showISOGuide ? "隐藏 ISO 指南 / Hide ISO Guide" : "显示 ISO 指南 / Show ISO Guide"}
        </Button>

        {showISOGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">ISO 感光度指南 / ISO Sensitivity Guide</CardTitle>
                <CardDescription className="text-lg">
                  了解不同感光度胶片的特点和使用场景 / Understanding different film speeds and their use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {ISOGuide.map((category) => {
                    const Icon = category.icon;
                    return (
                      <motion.div
                        key={category.range}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card className="bg-muted/50 h-full border-primary/10 hover:border-primary/30 transition-colors">
                          <CardHeader>
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5 text-primary" />
                              <CardTitle className="text-lg">{category.range}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-1 text-primary">特点 Characteristics:</h4>
                              <p className="text-sm">{category.characteristics.en}</p>
                              <p className="text-sm text-muted-foreground">{category.characteristics.zh}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1 text-primary">使用场景 Conditions:</h4>
                              <p className="text-sm">{category.conditions.en}</p>
                              <p className="text-sm text-muted-foreground">{category.conditions.zh}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1 text-primary">使用建议 Tips:</h4>
                              <p className="text-sm">{category.tips.en}</p>
                              <p className="text-sm text-muted-foreground">{category.tips.zh}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-4 flex-wrap">
            <Button
              variant={selectedCategory === "B&W" ? "default" : "outline"}
              onClick={() => setSelectedCategory("B&W")}
              className="flex-1 md:flex-none hover:bg-primary/90 transition-colors"
            >
              黑白胶片 B&W Films
            </Button>
            <Button
              variant={selectedCategory === "Color" ? "default" : "outline"}
              onClick={() => setSelectedCategory("Color")}
              className="flex-1 md:flex-none hover:bg-primary/90 transition-colors"
            >
              彩色负片 Color Negative
            </Button>
            <Button
              variant={selectedCategory === "Slide" ? "default" : "outline"}
              onClick={() => setSelectedCategory("Slide")}
              className="flex-1 md:flex-none hover:bg-primary/90 transition-colors"
            >
              反转片 Slide Film
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索胶片名称、厂商、ISO / Search by film name, manufacturer, ISO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-primary/20 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {selectedCategory === "Color" && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">C-41 工艺注意事项 Process Notes:</h3>
            <ul className="space-y-2 text-sm">
              <li>• 温度控制关键：需严格保持38°C（±0.3°C）</li>
              <li>• 显影阶段：前30秒连续搅动，之后每30秒搅动5秒</li>
              <li>• 标准工艺：显影 3:15 → 漂白 6:30 → 定影 4:20 → 稳定 1:00</li>
            </ul>
          </div>
        )}

        {selectedCategory === "Slide" && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">E-6 工艺注意事项 Process Notes:</h3>
            <ul className="space-y-2 text-sm">
              <li>• 温度控制关键：需严格保持38°C（±0.3°C）</li>
              <li>• 显影阶段：前30秒连续搅动，之后每30秒搅动5秒</li>
              <li>• 标准工艺：首显 6:00-6:30 → 反转(白光30秒) → 彩显 6:00 → 漂白 7:00 → 定影 4:00</li>
            </ul>
          </div>
        )}

        <motion.div
          className="grid grid-cols-1 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredFilms?.map((film) => (
            <motion.div
              key={film.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{film.nameEn}</CardTitle>
                      <CardDescription>{film.nameZh}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge>{film.type}</Badge>
                      <Badge variant="secondary">ISO {film.iso}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="print-hide hover:bg-primary/10 transition-colors"
                        onClick={() => handlePrint(film)}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print Guide
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p><strong>厂商 Manufacturer:</strong> {film.manufacturer}</p>
                      <div className="mt-4 space-y-1">
                        <p className="text-sm">{film.descriptionEn}</p>
                        <p className="text-sm text-muted-foreground">{film.descriptionZh}</p>
                      </div>
                    </div>

                    {filmUsageAdvice[film.nameEn] && (
                      <Accordion type="single" collapsible>
                        <AccordionItem value="usage">
                          <AccordionTrigger className="flex items-center gap-2 hover:bg-primary/10 transition-colors">
                            <Info className="h-4 w-4 text-primary" />
                            使用建议 Usage Advice
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="p-4 space-y-4">
                              <p>{filmUsageAdvice[film.nameEn].en}</p>
                              <p className="text-muted-foreground">{filmUsageAdvice[film.nameEn].zh}</p>
                              <ul className="list-disc pl-6 space-y-2">
                                {filmUsageAdvice[film.nameEn].tips.map((tip, index) => (
                                  <li key={index} className="text-sm">{tip}</li>
                                ))}
                              </ul>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}

                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary">
                        <Camera className="h-4 w-4" />
                        示例图片 Example Images
                      </h4>
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={getFilmExampleUrl(film.nameEn)}
                          alt={`Example photo taken with ${film.nameEn}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex gap-4">
                      <Button
                        asChild
                        className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                        onClick={() => window.open(getPurchaseLink(film.nameEn, 'global'), '_blank')}
                      >
                        <a href={getPurchaseLink(film.nameEn, 'global')} target="_blank" rel="noopener noreferrer">
                          <ShoppingCart className="h-4 w-4 text-primary" />
                          Buy Global
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        asChild
                        className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                        onClick={() => window.open(getPurchaseLink(film.nameEn, 'china'), '_blank')}
                      >
                        <a href={getPurchaseLink(film.nameEn, 'china')} target="_blank" rel="noopener noreferrer">
                          <ShoppingCart className="h-4 w-4 text-primary" />
                          淘宝购买
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {(!filteredFilms || filteredFilms.length === 0) && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted-foreground text-lg">
              {searchQuery ? '未找到匹配的胶片 / No matching films found' : '暂无胶片数据 / No films available'}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}