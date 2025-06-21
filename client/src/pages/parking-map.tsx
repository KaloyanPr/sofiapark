import { useState, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { ParkingHeader } from "@/components/parking-header";
import { SearchBar } from "@/components/search-bar";
import { ParkingMap } from "@/components/parking-map";
import { ParkingDetailsSheet } from "@/components/parking-details-sheet";
import { MapControls } from "@/components/map-controls";
import { MapLegend } from "@/components/map-legend";
import { Button } from "@/components/ui/button";
import { useParkingLocations, useSearchParkingLocations, useRefreshParkingData } from "@/hooks/use-parking-data";
import type { ParkingLocation, MapCenter, SearchFilters } from "@/types/parking";

const SOFIA_CENTER: MapCenter = {
  lat: 42.6977,
  lng: 23.3219,
};

export default function ParkingMapPage() {
  const [selectedParking, setSelectedParking] = useState<ParkingLocation | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    availableOnly: false,
    freeOnly: false,
    mallOnly: false,
  });

  const { data: allLocations, isLoading, error } = useParkingLocations();
  const { data: searchResults } = useSearchParkingLocations(searchQuery);
  const refreshMutation = useRefreshParkingData();

  // Filter and sort locations
  const filteredLocations = useMemo(() => {
    let locations = searchQuery ? searchResults || [] : allLocations || [];

    // Apply filters
    if (filters.availableOnly) {
      locations = locations.filter(loc => loc.status === "available");
    }
    if (filters.freeOnly) {
      locations = locations.filter(loc => parseFloat(loc.pricePerHour) === 0);
    }
    if (filters.mallOnly) {
      locations = locations.filter(loc => loc.type === "mall");
    }

    return locations;
  }, [allLocations, searchResults, searchQuery, filters]);

  const handleMarkerClick = (location: ParkingLocation) => {
    setSelectedParking(location);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedParking(null);
  };

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const handleZoomIn = () => {
    // Handled by map component
  };

  const handleZoomOut = () => {
    // Handled by map component
  };

  const handleCenter = () => {
    // Handled by map component
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load parking data</h2>
          <p className="text-gray-600 mb-4">Please check your connection and try again.</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <ParkingHeader />
      
      <SearchBar
        onSearch={setSearchQuery}
        onFiltersChange={setFilters}
        filters={filters}
      />

      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sofia-blue mx-auto mb-2"></div>
              <div className="text-sm text-gray-600">Loading parking data...</div>
            </div>
          </div>
        ) : (
          <>
            <ParkingMap
              locations={filteredLocations}
              center={SOFIA_CENTER}
              onMarkerClick={handleMarkerClick}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onCenter={handleCenter}
            />
            
            <MapControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onCenter={handleCenter}
            />
            
            <MapLegend />
          </>
        )}
      </div>

      <ParkingDetailsSheet
        parking={selectedParking}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
      />

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-6 right-6 bg-sofia-blue text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-shadow z-20"
        onClick={handleRefresh}
        disabled={refreshMutation.isPending}
      >
        <RotateCcw className={`h-5 w-5 ${refreshMutation.isPending ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}
