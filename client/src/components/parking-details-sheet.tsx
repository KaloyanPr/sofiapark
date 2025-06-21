import { X, Navigation, Bookmark, Accessibility, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ParkingLocation } from "@/types/parking";

interface ParkingDetailsSheetProps {
  parking: ParkingLocation | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ParkingDetailsSheet({ parking, isOpen, onClose }: ParkingDetailsSheetProps) {
  if (!parking) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-50 border-green-200 text-green-800";
      case "limited":
        return "bg-orange-50 border-orange-200 text-orange-800";
      case "full":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getStatusIndicatorColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-available";
      case "limited":
        return "bg-limited";
      case "full":
        return "bg-full";
      default:
        return "bg-gray-400";
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "accessible":
        return <Accessibility className="h-3 w-3 mr-1" />;
      case "secure":
        return <Shield className="h-3 w-3 mr-1" />;
      case "ev_charging":
        return <Zap className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getFeatureColor = (feature: string) => {
    switch (feature) {
      case "accessible":
        return "bg-blue-100 text-blue-800";
      case "secure":
        return "bg-green-100 text-green-800";
      case "ev_charging":
        return "bg-purple-100 text-purple-800";
      case "covered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateDistance = () => {
    // Mock distance calculation - in real app would use geolocation
    return Math.floor(Math.random() * 500) + 100;
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl transform transition-transform duration-300 z-30 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="p-4">
        {/* Handle */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
        
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {parking.name}
              </h3>
              <p className="text-sm text-gray-600">
                {parking.address}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </div>

          {/* Status Card */}
          <div className={`border rounded-lg p-3 ${getStatusColor(parking.status)}`}>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusIndicatorColor(parking.status)}`}></div>
              <span className="text-sm font-medium capitalize">{parking.status}</span>
              <span className="text-sm">
                {parking.availableSpots} of {parking.totalSpots} spots free
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Price</div>
              <div className="text-lg font-medium text-gray-900">
                {parking.pricePerHour === "0.00" ? "Free" : `${parking.pricePerHour} ${parking.currency}/hour`}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Distance</div>
              <div className="text-lg font-medium text-gray-900">
                {calculateDistance()}m
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Hours</div>
              <div className="text-lg font-medium text-gray-900">
                {parking.hours}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Type</div>
              <div className="text-lg font-medium text-gray-900 capitalize">
                {parking.type}
              </div>
            </div>
          </div>

          {/* Features */}
          {parking.features && parking.features.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Features</div>
              <div className="flex flex-wrap gap-2">
                {parking.features.map((feature) => (
                  <Badge
                    key={feature}
                    variant="secondary"
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getFeatureColor(feature)}`}
                  >
                    {getFeatureIcon(feature)}
                    {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-sofia-blue text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
            <Button
              variant="secondary"
              className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Reserve Spot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
