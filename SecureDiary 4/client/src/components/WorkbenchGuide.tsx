import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Beaker, Thermometer, Clock, AlertTriangle, RotateCcw, Scale, Droplets } from "lucide-react";

const cardVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const contentVariants = {
  initial: { y: 0 },
  hover: {
    y: -2,
    transition: { duration: 0.2 }
  }
};

export function WorkbenchGuide() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">暗房工作台设置指南 Darkroom Workbench Setup Guide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-muted/50 p-6 rounded-xl"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            工具准备 Equipment Preparation
          </h3>
          <div className="space-y-2 text-sm">
            <p>1. 显影工具准备：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>4个显影罐/槽 (四个不同颜色标记)</li>
              <li>温度计 (可测量0-30°C)</li>
              <li>定时器</li>
              <li>搅拌棒</li>
              <li>干净抹布</li>
            </ul>
            <p>2. 显影液准备：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>显影液 (Developer)</li>
              <li>停显液 (Stop bath)</li>
              <li>定影液 (Fixer)</li>
              <li>清水 (Water)</li>
            </ul>
            <p>3. 确保所有显影罐清洁无污染</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-muted/50 p-6 rounded-xl"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            温度控制 Temperature Control
          </h3>
          <div className="space-y-2 text-sm">
            <p className="font-medium">标准显影温度设置：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>基准温度：20°C (68°F)</li>
              <li>允许范围：18-22°C (64-72°F)</li>
            </ul>
            <p className="font-medium mt-4">温度调节指南：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>低于20°C：每降低1°C增加15秒显影时间</li>
              <li>高于20°C：每升高1°C减少15秒显影时间</li>
              <li>建议：使用恒温水浴保持温度稳定</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-muted/50 p-6 rounded-xl"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            搅拌技巧 Agitation Technique
          </h3>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">初始搅拌：</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>前30秒连续温和搅拌</li>
                  <li>搅拌幅度：轻柔180度翻转</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">间歇搅拌：</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>每30秒搅拌5次</li>
                  <li>保持节奏均匀一致</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-muted/50 p-6 rounded-xl"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            显影步骤 Processing Steps
          </h3>
          <div className="space-y-2 text-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="border rounded-lg p-4"
              >
                <motion.div variants={contentVariants}>
                  <p className="font-medium flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-purple-500" />
                    预湿 Pre-soak
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>时间：1分钟</li>
                    <li>水温：与显影液相同</li>
                    <li>轻柔搅拌</li>
                  </ul>
                </motion.div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="border rounded-lg p-4"
              >
                <motion.div variants={contentVariants}>
                  <p className="font-medium flex items-center gap-2">
                    <Beaker className="h-4 w-4 text-blue-500" />
                    显影 Development
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>时间：参考显影时间表</li>
                    <li>初始30秒持续搅拌</li>
                    <li>之后每30秒搅拌5次</li>
                  </ul>
                </motion.div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="border rounded-lg p-4"
              >
                <motion.div variants={contentVariants}>
                  <p className="font-medium flex items-center gap-2">
                    <Beaker className="h-4 w-4 text-yellow-500" />
                    停显 Stop Bath
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>时间：1分钟</li>
                    <li>温度要求不严格</li>
                    <li>间歇性轻柔搅拌</li>
                  </ul>
                </motion.div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="border rounded-lg p-4"
              >
                <motion.div variants={contentVariants}>
                  <p className="font-medium flex items-center gap-2">
                    <Beaker className="h-4 w-4 text-green-500" />
                    定影 Fixing
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>时间：5分钟</li>
                    <li>每1分钟搅拌一次</li>
                    <li>观察胶片透明度变化</li>
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-muted/50 p-6 rounded-xl"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            注意事项 Important Notes
          </h3>
          <div className="space-y-2 text-sm">
            <p>1. 安全与准确性：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>确保暗房光线安全</li>
              <li>所有时间精确计时</li>
              <li>温度定期检查</li>
            </ul>
            <p>2. 显影液管理：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>定期更换显影液</li>
              <li>避免交叉污染</li>
              <li>标记液体使用次数</li>
            </ul>
            <p>3. 操作建议：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>动作要轻柔避免晃动</li>
              <li>保持工作台整洁</li>
              <li>做好记录便于复现</li>
            </ul>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}