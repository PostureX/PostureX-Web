import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUploadDetail } from "@/hooks/UploadDetailContext";
import { View } from "@/types";

const viewConfigs = {
  front: { label: "Front View" },
  back: { label: "Back View" },
  left: { label: "Left Side" },
  right: { label: "Right Side" },
};

export default function UploadsViewSelector() {
  const { videoUrls, currentView, setCurrentView } = useUploadDetail();
  const availableViews: View[] = Object.keys(videoUrls || {}) as View[];
  if (!availableViews.length) return null;
  return (
    <div className="container mx-auto max-w-7xl px-4 pt-6 pb-2">
      <Tabs value={currentView} onValueChange={(view) => setCurrentView(view as View)} className="w-full flex justify-center">
        <TabsList className="flex gap-2 justify-center">
          {availableViews.map((viewType) => {
            const config = viewConfigs[viewType as keyof typeof viewConfigs];
            return (
              <TabsTrigger key={viewType} value={viewType} className="min-w-[100px]">
                {config?.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}
