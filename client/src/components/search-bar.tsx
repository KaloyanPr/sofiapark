import { useState, useEffect } from "react";
import { Search, MapPin, Clock, Euro, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SearchFilters } from "@/types/parking";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export function SearchBar({ onSearch, onFiltersChange, filters }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  const handleFilterClick = (filterType: keyof SearchFilters) => {
    if (filterType === "availableOnly") {
      onFiltersChange({ ...filters, availableOnly: !filters.availableOnly });
    } else if (filterType === "freeOnly") {
      onFiltersChange({ ...filters, freeOnly: !filters.freeOnly });
    } else if (filterType === "mallOnly") {
      onFiltersChange({ ...filters, mallOnly: !filters.mallOnly });
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 relative z-20">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-sofia-blue focus:border-sofia-blue"
          placeholder="Search Sofia neighborhoods, streets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Quick Filters */}
      <div className="flex space-x-2 mt-3 overflow-x-auto pb-1">
        <Button
          size="sm"
          className="flex-shrink-0 px-3 py-1 bg-sofia-blue text-white text-sm rounded-full hover:bg-blue-700"
        >
          <MapPin className="h-3 w-3 mr-1" />
          All Areas
        </Button>
        <Button
          size="sm"
          variant={filters.availableOnly ? "default" : "secondary"}
          className="flex-shrink-0 px-3 py-1 text-sm rounded-full"
          onClick={() => handleFilterClick("availableOnly")}
        >
          <Clock className="h-3 w-3 mr-1" />
          Available Now
        </Button>
        <Button
          size="sm"
          variant={filters.freeOnly ? "default" : "secondary"}
          className="flex-shrink-0 px-3 py-1 text-sm rounded-full"
          onClick={() => handleFilterClick("freeOnly")}
        >
          <Euro className="h-3 w-3 mr-1" />
          Free Parking
        </Button>
        <Button
          size="sm"
          variant={filters.mallOnly ? "default" : "secondary"}
          className="flex-shrink-0 px-3 py-1 text-sm rounded-full"
          onClick={() => handleFilterClick("mallOnly")}
        >
          <Building className="h-3 w-3 mr-1" />
          Mall Parking
        </Button>
      </div>
    </div>
  );
}
