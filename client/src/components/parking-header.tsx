import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ParkingHeaderProps {
  onMenuToggle?: () => void;
}

export function ParkingHeader({ onMenuToggle }: ParkingHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.();
  };

  return (
    <header className="bg-white shadow-md relative z-30">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sofia-blue rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 3h12v2H6zM4 7v10a2 2 0 002 2h12a2 2 0 002-2V7H4zm2 8h12v2H6v-2z"/>
            </svg>
          </div>
          <h1 className="text-xl font-medium text-gray-800">Sofia Parking</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5 text-gray-600" />
          ) : (
            <Menu className="h-5 w-5 text-gray-600" />
          )}
        </Button>
      </div>
    </header>
  );
}
