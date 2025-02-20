import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Thermometer, Clock, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

interface Step {
  id: number;
  nameEn: string;
  nameZh: string;
  duration: number;
  temperature: number;
  agitationInterval?: number;
  isTemperatureCritical: boolean;
  color: string;
}

interface Props {
  filmId?: string;
  developerId?: string;
  developerTime?: number;
}

export function PushPullVisualizer({ filmId, developerId, developerTime = 7 }: Props) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [nextAgitation, setNextAgitation] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(20);
  const baseTemp = 20;

  const getTemperatureAdjustedTime = (baseTimeMinutes: number) => {
    const baseTimeSeconds = baseTimeMinutes * 60;
    const tempDiff = baseTemp - temperature;
    const adjustmentSeconds = tempDiff * 15;
    return Math.max(baseTimeSeconds + adjustmentSeconds, 240);
  };

  const developmentSteps: Step[] = [
    {
      id: 1,
      nameEn: "Pre-soak",
      nameZh: "预湿",
      duration: 60,
      temperature: temperature,
      isTemperatureCritical: false,
      color: "rgb(147, 51, 234)" // purple-600
    },
    {
      id: 2,
      nameEn: "Developer",
      nameZh: "显影",
      duration: getTemperatureAdjustedTime(developerTime),
      temperature: temperature,
      agitationInterval: 30,
      isTemperatureCritical: true,
      color: "rgb(59, 130, 246)" // blue-500
    },
    {
      id: 3,
      nameEn: "Stop Bath",
      nameZh: "停显",
      duration: 60,
      temperature: temperature,
      isTemperatureCritical: false,
      color: "rgb(234, 179, 8)" // yellow-500
    },
    {
      id: 4,
      nameEn: "Fixer",
      nameZh: "定影",
      duration: 300,
      temperature: temperature,
      agitationInterval: 60,
      isTemperatureCritical: false,
      color: "rgb(34, 197, 94)" // green-500
    },
    {
      id: 5,
      nameEn: "Wash",
      nameZh: "水洗",
      duration: 600,
      temperature: temperature,
      isTemperatureCritical: false,
      color: "rgb(14, 165, 233)" // sky-500
    },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && currentStep > 0) {
      const step = developmentSteps[currentStep - 1];
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });

        if (step.agitationInterval) {
          setNextAgitation((prev) => {
            if (prev <= 1) {
              return step.agitationInterval!;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, currentStep, developmentSteps]);

  const startStep = (stepIndex: number) => {
    setCurrentStep(stepIndex + 1);
    setTimeRemaining(developmentSteps[stepIndex].duration);
    if (developmentSteps[stepIndex].agitationInterval) {
      setNextAgitation(developmentSteps[stepIndex].agitationInterval!);
    }
    setIsRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = (step: Step) => {
    if (!isRunning || currentStep !== step.id) return 0;
    return ((step.duration - timeRemaining) / step.duration) * 100;
  };

  const cardVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    active: {
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  };

  const textVariants = {
    initial: { y: 0 },
    hover: {
      y: -2,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-background to-muted">
        <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
          冲洗进度可视化 Development Progress Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-muted/50 to-background p-6 rounded-xl mb-8"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-primary" />
                温度设置 Temperature Setting (°C)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="15"
                  max="25"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-24"
                />
                {temperature !== 20 && (
                  <span className="text-sm text-muted-foreground">
                    {temperature < 20 ? "+" : "-"}{Math.abs(temperature - 20) * 15}秒 / {temperature < 20 ? "+" : "-"}{Math.abs(temperature - 20) * 15}s
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            {developmentSteps.slice(0, 3).map((step, index) => {
              const progress = calculateProgress(step);
              const isActive = currentStep === step.id;
              const isComplete = currentStep > step.id;
              const isDisabled = isRunning || (index > 0 && currentStep !== index);

              return (
                <motion.div
                  key={step.id}
                  initial="initial"
                  whileHover={!isDisabled ? "hover" : undefined}
                  animate={isActive ? "active" : "initial"}
                  variants={cardVariants}
                  onClick={() => !isDisabled && startStep(index)}
                  className="group"
                >
                  <div
                    className={`relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                      isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:shadow-lg'
                    } ${
                      isActive ? 'border-primary shadow-xl ring-2 ring-primary/20' : isComplete ? 'border-primary/20' : 'border-border'
                    }`}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${step.color}30, ${step.color}50)`
                        : isComplete
                        ? `linear-gradient(135deg, ${step.color}05, ${step.color}10)`
                        : undefined,
                      boxShadow: isActive ? `0 8px 30px ${step.color}30` : undefined
                    }}
                  >
                    {progress > 0 && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        style={{
                          background: `linear-gradient(to top, ${step.color}, transparent)`,
                          height: `${progress}%`
                        }}
                      />
                    )}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br"
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          background: `linear-gradient(135deg, ${step.color}, transparent)`
                        }}
                      />
                    )}
                    <div className="relative p-6">
                      <motion.div
                        className="space-y-2"
                        variants={textVariants}
                      >
                        <h3 className={`text-lg ${isActive ? 'font-bold text-foreground' : 'font-medium'}`}>
                          {step.nameZh}
                          <span className={`block text-sm mt-1 ${isActive ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                            {step.nameEn}
                          </span>
                        </h3>
                        <div className={`flex items-center gap-2 text-sm ${isActive ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                          <Clock className="h-4 w-4" />
                          {formatTime(step.duration)}
                        </div>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4"
                          >
                            <p className="text-4xl font-bold tracking-tight text-foreground">
                              {formatTime(timeRemaining)}
                            </p>
                            {step.agitationInterval && (
                              <motion.div
                                animate={{ scale: nextAgitation <= 5 ? [1, 1.1, 1] : 1 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground"
                              >
                                <RotateCcw className="h-4 w-4" />
                                {formatTime(nextAgitation)}
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                        {!isActive && !isComplete && (
                          <motion.p
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1 }}
                            className="text-sm font-bold mt-2 text-primary"
                          >
                            开始 Start
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="space-y-6">
            {developmentSteps.slice(3).map((step, index) => {
              const progress = calculateProgress(step);
              const isActive = currentStep === step.id;
              const isComplete = currentStep > step.id;
              const isDisabled = isRunning || (index + 3 > 0 && currentStep !== index + 3);

              return (
                <motion.div
                  key={step.id}
                  initial="initial"
                  whileHover={!isDisabled ? "hover" : undefined}
                  animate={isActive ? "active" : "initial"}
                  variants={cardVariants}
                  onClick={() => !isDisabled && startStep(index + 3)}
                  className="group"
                >
                  <div
                    className={`relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                      isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:shadow-lg'
                    } ${
                      isActive ? 'border-primary shadow-xl ring-2 ring-primary/20' : isComplete ? 'border-primary/20' : 'border-border'
                    }`}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${step.color}30, ${step.color}50)`
                        : isComplete
                        ? `linear-gradient(135deg, ${step.color}05, ${step.color}10)`
                        : undefined,
                      boxShadow: isActive ? `0 8px 30px ${step.color}30` : undefined
                    }}
                  >
                    {progress > 0 && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        style={{
                          background: `linear-gradient(to top, ${step.color}, transparent)`,
                          height: `${progress}%`
                        }}
                      />
                    )}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br"
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          background: `linear-gradient(135deg, ${step.color}, transparent)`
                        }}
                      />
                    )}
                    <div className="relative p-6">
                      <motion.div
                        className="space-y-2"
                        variants={textVariants}
                      >
                        <h3 className={`text-lg ${isActive ? 'font-bold text-foreground' : 'font-medium'}`}>
                          {step.nameZh}
                          <span className={`block text-sm mt-1 ${isActive ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                            {step.nameEn}
                          </span>
                        </h3>
                        <div className={`flex items-center gap-2 text-sm ${isActive ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                          <Clock className="h-4 w-4" />
                          {formatTime(step.duration)}
                        </div>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4"
                          >
                            <p className="text-4xl font-bold tracking-tight text-foreground">
                              {formatTime(timeRemaining)}
                            </p>
                            {step.agitationInterval && (
                              <motion.div
                                animate={{ scale: nextAgitation <= 5 ? [1, 1.1, 1] : 1 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground"
                              >
                                <RotateCcw className="h-4 w-4" />
                                {formatTime(nextAgitation)}
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                        {!isActive && !isComplete && (
                          <motion.p
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1 }}
                            className="text-sm font-bold mt-2 text-primary"
                          >
                            开始 Start
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}