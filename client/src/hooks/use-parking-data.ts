import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ParkingLocation } from "@/types/parking";

export function useParkingLocations() {
  return useQuery<ParkingLocation[]>({
    queryKey: ["/api/parking-locations"],
  });
}

export function useParkingLocation(id: number) {
  return useQuery<ParkingLocation>({
    queryKey: ["/api/parking-locations", id],
    enabled: !!id,
  });
}

export function useSearchParkingLocations(query: string) {
  return useQuery<ParkingLocation[]>({
    queryKey: ["/api/parking-locations/search", query],
    enabled: !!query && query.length > 2,
  });
}

export function useParkingLocationsByDistrict(district: string) {
  return useQuery<ParkingLocation[]>({
    queryKey: ["/api/parking-locations/district", district],
    enabled: !!district,
  });
}

export function useUpdateParkingAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, availableSpots }: { id: number; availableSpots: number }) => {
      const response = await apiRequest("PATCH", `/api/parking-locations/${id}/availability`, {
        availableSpots,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/parking-locations"] });
      queryClient.setQueryData(["/api/parking-locations", data.id], data);
    },
  });
}

export function useRefreshParkingData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/parking-locations"] });
    },
  });
}

export function useCreateParkingLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location: any) => {
      const response = await apiRequest("POST", "/api/parking-locations", location);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/parking-locations"] });
    },
  });
}
