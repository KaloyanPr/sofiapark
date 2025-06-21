import { Plus, Minus, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
}

export function MapControls({ onZoomIn, onZoomOut, onCenter }: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
      <Button
        size="sm"
        className="bg-white rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow text-gray-700 hover:text-gray-900"
        variant="outline"
        onClick={onZoomIn}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        className="bg-white rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow text-gray-700 hover:text-gray-900"
        variant="outline"
        onClick={onZoomOut}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        className="bg-white rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow text-gray-700 hover:text-gray-900"
        variant="outline"
        onClick={onCenter}
      >
        <Crosshair className="h-4 w-4" />
      </Button>
    </div>
  );
}
