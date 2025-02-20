import { PushPullGuide } from "@/components/PushPullGuide";
import { WorkbenchGuide } from "@/components/WorkbenchGuide";

export default function PushPullPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <PushPullGuide />
      <WorkbenchGuide />
    </div>
  );
}