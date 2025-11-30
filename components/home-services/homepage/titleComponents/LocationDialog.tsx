"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LocationDialogProps {
  open: boolean;
  /* eslint-disable no-unused-vars */
  onOpenChange: (open: boolean) => void;
  onZipCodeChange: (zip: string) => void;
  /* elslint-enable no-unused-vars */
  zipCode: string;
  onSetCurrentLocation: () => void;
  isLoading: boolean;
  error?: string;
}

const LocationDialog: React.FC<LocationDialogProps> = ({
  open,
  onOpenChange,
  zipCode,
  onZipCodeChange,
  onSetCurrentLocation,
  isLoading,
  error,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            Set Your Location
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Enter your zip code or use your current location
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label
              htmlFor="zipcode"
              className="block text-sm font-medium dark:text-gray-300"
            >
              US Zip Code
            </label>
            <div className="flex gap-2">
              <Input
                id="zipcode"
                placeholder="Enter 5-digit zip code"
                value={zipCode}
                onChange={(e) => onZipCodeChange(e.target.value)}
                className="flex-1 focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-600 dark:bg-gray-800 dark:border-gray-700"
              />
              {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                Or
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onSetCurrentLocation}
            disabled={isLoading}
            className="w-full bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <span>Use Current Location</span>
            )}
          </Button>
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
