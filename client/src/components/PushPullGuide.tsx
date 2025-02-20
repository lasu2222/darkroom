import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PushPullVisualizer } from "./PushPullVisualizer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const filmStocks = [
  { 
    id: "fp4",
    nameEn: "Ilford FP4+",
    nameZh: "FP4+黑白胶片",
    iso: 125,
    developers: {
      d76: {
        standard: 9,
        pullOne: 8,
        pushOne: 12
      }
    }
  },
  { 
    id: "hp5",
    nameEn: "Ilford HP5+",
    nameZh: "HP5+黑白胶片",
    iso: 400,
    developers: {
      d76: {
        standard: 7.5,
        pullOne: 6,
        pushOne: 9
      },
      ddx: {
        standard: 6,
        pullOne: 5,
        pushOne: 7.5
      }
    }
  },
  { 
    id: "trix",
    nameEn: "Kodak Tri-X 400",
    nameZh: "柯达Tri-X黑白胶片",
    iso: 400,
    developers: {
      d76: {
        standard: 7,
        pullOne: 6,
        pushOne: 9
      }
    }
  },
  { 
    id: "tmax100",
    nameEn: "Kodak T-Max 100",
    nameZh: "柯达T-Max 100黑白胶片",
    iso: 100,
    developers: {
      d76: {
        standard: 9,
        pullOne: 7,
        pushOne: 12
      }
    }
  },
  { 
    id: "delta3200",
    nameEn: "Ilford Delta 3200",
    nameZh: "Delta 3200黑白胶片",
    iso: 3200,
    developers: {
      d76: {
        standard: 15,
        pullOne: 12,
        pushOne: 18
      },
      ddx: {
        standard: 14,
        pullOne: 11,
        pushOne: 17
      }
    }
  },
  { 
    id: "tmax3200",
    nameEn: "Kodak T-Max 3200",
    nameZh: "柯达T-Max 3200黑白胶片",
    iso: 3200,
    developers: {
      d76: {
        standard: 15,
        pullOne: 12,
        pushOne: 18
      }
    }
  },
  { 
    id: "delta100",
    nameEn: "Ilford Delta 100",
    nameZh: "Delta 100黑白胶片",
    iso: 100,
    developers: {
      d76: {
        standard: 8,
        pullOne: 6,
        pushOne: 11
      }
    }
  }
];

const developers = [
  { 
    id: "d76",
    nameEn: "Kodak D-76",
    nameZh: "柯达D-76显影液",
    description: {
      en: "Classic developer with balanced contrast and grain",
      zh: "经典显影液，平衡的对比度和颗粒"
    }
  },
  { 
    id: "ddx",
    nameEn: "Ilfotec DD-X",
    nameZh: "爱尔福DD-X显影液",
    description: {
      en: "Fine grain and excellent shadow detail",
      zh: "细腻颗粒和出色的暗部细节"
    }
  }
];

type IsoStop = -2 | -1 | 0 | 1 | 2;

const notes = {
  temperature: {
    en: "Base development times are for 20°C (68°F). Add 15 seconds for every 1°C below, subtract 15 seconds for every 1°C above.",
    zh: "基准显影时间基于20°C (68°F)。每低于1°C增加15秒，每高于1°C减少15秒。"
  },
  pushing: {
    en: "Pushing (+1, +2 stops) increases contrast and grain. Extend development time.",
    zh: "推片（+1、+2挡）增加对比度和颗粒感，需要延长显影时间。"
  },
  pulling: {
    en: "Pulling (-1, -2 stops) reduces contrast and grain. Reduce development time.",
    zh: "欠冲（-1、-2挡）降低对比度和颗粒感，需要缩短显影时间。"
  },
  extremePush: {
    en: "Extreme pushing (+2 stops) results in very high contrast and pronounced grain.",
    zh: "极限推片（+2挡）会导致很高的对比度和明显的颗粒感。"
  },
  extremePull: {
    en: "Extreme pulling (-2 stops) results in very low contrast and muted tones.",
    zh: "极限欠冲（-2挡）会导致很低的对比度和柔和的色调。"
  },
  pushPullExplanation: {
    zh: `"推拉冲扫"是指在黑白胶片显影过程中，通过调整显影时间来改变胶片的感光度（ISO），从而影响图像的对比度、颗粒感和细节表现。
推（Push Processing）：
• 在拍摄时使用更高的ISO设置
• 通过延长显影时间来补偿曝光不足
• 增加对比度和颗粒感
• 适用于低光环境拍摄

拉（Pull Processing）：
• 在拍摄时使用更低的ISO设置
• 通过缩短显影时间来避免过度显影
• 降低对比度，获得更细腻的颗粒感
• 适用于过曝场景或追求柔和效果`,
    en: `Push/Pull processing refers to the technique of adjusting development time to modify film sensitivity (ISO), affecting image contrast, grain, and detail rendition.
Push Processing:
• Use higher ISO setting during shooting
• Compensate by increasing development time
• Increases contrast and grain
• Ideal for low-light conditions

Pull Processing:
• Use lower ISO setting during shooting
• Compensate by reducing development time
• Reduces contrast, produces finer grain
• Useful for overexposed scenes or softer effects`
  }
};

export function PushPullGuide() {
  const [selectedFilm, setSelectedFilm] = useState(filmStocks[0].id);
  const [selectedDeveloper, setSelectedDeveloper] = useState(developers[0].id);
  const [selectedIsoStop, setSelectedIsoStop] = useState<IsoStop>(0);
  const [isIsoConfirmed, setIsIsoConfirmed] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const film = filmStocks.find(f => f.id === selectedFilm)!;
  const developer = developers.find(d => d.id === selectedDeveloper)!;

  const getDevelopmentTime = () => {
    if (!film.developers[selectedDeveloper] || !isIsoConfirmed) {
      return film.developers[selectedDeveloper]?.standard || 7;
    }

    const base = film.developers[selectedDeveloper].standard;

    switch (selectedIsoStop) {
      case -2:
        return Math.max(base * 0.7, 4); 
      case -1:
        return film.developers[selectedDeveloper].pullOne;
      case 1:
        return film.developers[selectedDeveloper].pushOne;
      case 2:
        return Math.min(base * 1.5, 15); 
      default:
        return base;
    }
  };

  const handleIsoChange = (stop: IsoStop) => {
    setSelectedIsoStop(stop);
    setIsIsoConfirmed(false);
  };

  const getEffectiveIso = () => {
    return film.iso * Math.pow(2, selectedIsoStop);
  };

  const getIsoWarningMessage = () => {
    if (Math.abs(selectedIsoStop) === 2) {
      return selectedIsoStop === 2 ? notes.extremePush : notes.extremePull;
    }
    return selectedIsoStop > 0 ? notes.pushing : notes.pulling;
  };

  return (
    <div className="space-y-6">
      <PushPullVisualizer 
        filmId={selectedFilm}
        developerId={selectedDeveloper}
        developerTime={getDevelopmentTime()}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">推拉冲洗指南 Push/Pull Processing Guide</CardTitle>
          <CardDescription>
            选择胶片和显影液以查看冲洗参数
            <br />
            Select film and developer to see processing parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full hover:bg-primary/10 transition-colors flex items-center justify-between"
                        onClick={() => setShowMore(!showMore)}
                      >
                        <span>什么是推拉冲扫？ What is Push/Pull Processing?</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
                      </Button>
                      {showMore && (
                        <div className="grid gap-4 md:grid-cols-2 mt-4">
                          <div className="space-y-2">
                            <p className="text-sm whitespace-pre-line">
                              {notes.pushPullExplanation.zh}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm whitespace-pre-line">
                              {notes.pushPullExplanation.en}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium">胶片 Film Stock</label>
                <Select value={selectedFilm} onValueChange={setSelectedFilm}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filmStocks.map((film) => (
                      <SelectItem key={film.id} value={film.id}>
                        {film.nameZh} / {film.nameEn} (ISO {film.iso})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium">显影液 Developer</label>
                <Select value={selectedDeveloper} onValueChange={setSelectedDeveloper}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {developers.map((developer) => (
                      <SelectItem key={developer.id} value={developer.id}>
                        {developer.nameZh} / {developer.nameEn}
                        <p className="text-xs text-muted-foreground">
                          {developer.description.zh} / {developer.description.en}
                        </p>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <p className="text-sm font-medium">
                    当前ISO设置 Current ISO Setting: {getEffectiveIso()}
                  </p>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <Button
                    variant={selectedIsoStop === -2 ? "default" : "outline"}
                    onClick={() => handleIsoChange(-2)}
                    className="relative"
                  >
                    -2 ({film.iso / 4})
                    {selectedIsoStop === -2 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-destructive rounded-full" />
                    )}
                  </Button>
                  <Button
                    variant={selectedIsoStop === -1 ? "default" : "outline"}
                    onClick={() => handleIsoChange(-1)}
                  >
                    -1 ({film.iso / 2})
                  </Button>
                  <Button
                    variant={selectedIsoStop === 0 ? "default" : "outline"}
                    onClick={() => handleIsoChange(0)}
                  >
                    0 ({film.iso})
                  </Button>
                  <Button
                    variant={selectedIsoStop === 1 ? "default" : "outline"}
                    onClick={() => handleIsoChange(1)}
                  >
                    +1 ({film.iso * 2})
                  </Button>
                  <Button
                    variant={selectedIsoStop === 2 ? "default" : "outline"}
                    onClick={() => handleIsoChange(2)}
                    className="relative"
                  >
                    +2 ({film.iso * 4})
                    {selectedIsoStop === 2 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-destructive rounded-full" />
                    )}
                  </Button>
                </div>
                {!isIsoConfirmed && (
                  <div className="mt-4">
                    <p className="text-sm text-yellow-500 mb-2">
                      {getIsoWarningMessage().zh}
                      <br />
                      {getIsoWarningMessage().en}
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => setIsIsoConfirmed(true)}
                    >
                      确认ISO更改 / Confirm ISO Change
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <ScrollArea className="h-[400px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ISO设置 Setting</TableHead>
                      <TableHead>显影时间 Development Time</TableHead>
                      <TableHead>推拉挡数 Push/Pull</TableHead>
                      <TableHead>备注 Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {film.developers[selectedDeveloper] && (
                      <>
                        <TableRow>
                          <TableCell>{film.iso / 4}</TableCell>
                          <TableCell>{Math.max(film.developers[selectedDeveloper].standard * 0.7, 4)} 分钟 mins</TableCell>
                          <TableCell>-2</TableCell>
                          <TableCell>{notes.extremePull.zh} / {notes.extremePull.en}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>{film.iso / 2}</TableCell>
                          <TableCell>{film.developers[selectedDeveloper].pullOne} 分钟 mins</TableCell>
                          <TableCell>-1</TableCell>
                          <TableCell>{notes.pulling.zh} / {notes.pulling.en}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>{film.iso}</TableCell>
                          <TableCell>{film.developers[selectedDeveloper].standard} 分钟 mins</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>标准显影 / Standard development</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>{film.iso * 2}</TableCell>
                          <TableCell>{film.developers[selectedDeveloper].pushOne} 分钟 mins</TableCell>
                          <TableCell>+1</TableCell>
                          <TableCell>{notes.pushing.zh} / {notes.pushing.en}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>{film.iso * 4}</TableCell>
                          <TableCell>{Math.min(film.developers[selectedDeveloper].standard * 1.5, 15)} 分钟 mins</TableCell>
                          <TableCell>+2</TableCell>
                          <TableCell>{notes.extremePush.zh} / {notes.extremePush.en}</TableCell>
                        </TableRow>
                      </>
                    )}
                    {!film.developers[selectedDeveloper] && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          暂无此组合的数据 / No data available for this combination
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-muted p-4 rounded-lg space-y-4">
                <div>
                  <h4 className="font-medium mb-2">温度补偿 Temperature Compensation</h4>
                  <p className="text-sm text-muted-foreground">
                    {notes.temperature.zh}
                    <br />
                    {notes.temperature.en}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">显影液特性 Developer Characteristics</h4>
                  <p className="text-sm text-muted-foreground">
                    {developer.description.zh}
                    <br />
                    {developer.description.en}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}