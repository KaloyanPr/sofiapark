export function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg z-10">
      <div className="text-xs font-medium text-gray-700 mb-2">Parking Status</div>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-available"></div>
          <span className="text-xs text-gray-600">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-limited"></div>
          <span className="text-xs text-gray-600">Limited</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-full"></div>
          <span className="text-xs text-gray-600">Full</span>
        </div>
      </div>
    </div>
  );
}
