import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, MapPin, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useCreateParkingLocation } from "@/hooks/use-parking-data";
import { insertParkingLocationSchema } from "@shared/schema";
import type { z } from "zod";
import type { ParkingLocation } from "@/types/parking";

type FormData = z.infer<typeof insertParkingLocationSchema>;

interface AddParkingFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: { lat: number; lng: number };
}

const PARKING_TYPES = [
  { value: "street", label: "Street Parking" },
  { value: "underground", label: "Underground Garage" },
  { value: "mall", label: "Mall Parking" },
  { value: "private", label: "Private Parking" },
];

const SOFIA_DISTRICTS = [
  "Sofia Center",
  "Lozenets",
  "Vitosha",
  "Mladost",
  "Lyulin",
  "Studentski Grad",
  "Izgrev",
  "Ovcha Kupel",
  "Slatina",
  "Krasno Selo",
];

const AVAILABLE_FEATURES = [
  { id: "accessible", label: "Wheelchair Accessible" },
  { id: "secure", label: "Security Cameras" },
  { id: "covered", label: "Covered Parking" },
  { id: "ev_charging", label: "EV Charging Stations" },
];

export function AddParkingForm({ isOpen, onClose, initialLocation }: AddParkingFormProps) {
  const { toast } = useToast();
  const createMutation = useCreateParkingLocation();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(insertParkingLocationSchema),
    defaultValues: {
      name: "",
      address: "",
      latitude: initialLocation ? initialLocation.lat.toString() : "",
      longitude: initialLocation ? initialLocation.lng.toString() : "",
      totalSpots: 10,
      availableSpots: 10,
      pricePerHour: "0.00",
      currency: "лв",
      type: "street",
      hours: "24/7",
      features: [],
      status: "available",
      district: "",
      landmark: "",
    },
  });

  const handleFeatureChange = (featureId: string, checked: boolean) => {
    const newFeatures = checked
      ? [...selectedFeatures, featureId]
      : selectedFeatures.filter(f => f !== featureId);
    
    setSelectedFeatures(newFeatures);
    form.setValue("features", newFeatures);
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync({
        ...data,
        features: selectedFeatures,
        type: data.type as "street" | "underground" | "mall" | "private",
      });
      
      toast({
        title: "Success",
        description: "Parking location added successfully!",
      });
      
      onClose();
      form.reset();
      setSelectedFeatures([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add parking location. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Add New Parking Location</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parking Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., NDK Underground Parking" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bulgaria Blvd 1, Sofia Center" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SOFIA_DISTRICTS.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="landmark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nearby Landmark</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., NDK, Vitosha Blvd" 
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location Coordinates */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Location Coordinates</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.000001"
                          placeholder="42.6977 (optional)"
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.000001"
                          placeholder="23.3219 (optional)"
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Parking Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Parking Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parking Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PARKING_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operating Hours *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 8:00-20:00 or 24/7" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="totalSpots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Spots *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableSpots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Spots *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pricePerHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Hour (лв) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.10"
                          min="0"
                          placeholder="2.50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Features</h3>
              <div className="grid grid-cols-2 gap-4">
                {AVAILABLE_FEATURES.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature.id}
                      checked={selectedFeatures.includes(feature.id)}
                      onCheckedChange={(checked) => 
                        handleFeatureChange(feature.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={feature.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {feature.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-sofia-blue text-white hover:bg-blue-700"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Parking Location
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}