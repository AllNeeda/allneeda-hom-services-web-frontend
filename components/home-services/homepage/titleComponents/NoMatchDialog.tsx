"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NoMatchDialogProps {
  open: boolean;
  /* eslint-disable no-unused-vars */
  onOpenChange: (open: boolean) => void;
  onServiceSelect: (service: string) => void;
  /* elslint-enable no-unused-vars */
  suggestedServices?: string[];
  noServiceInZipCode: boolean;
  zipCode: string;
}

const NoMatchDialog = ({
  open,
  onOpenChange,
  suggestedServices = [],
  onServiceSelect,
  noServiceInZipCode,
  zipCode,
}: NoMatchDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {noServiceInZipCode
              ? "Service Not Available"
              : "No Exact Match Found"}
          </DialogTitle>
        </DialogHeader>
        {noServiceInZipCode ? (
          <div className="py-4">
            <p>No services found in the zip code area: {zipCode}</p>
            <p>Please try a different location.</p>
          </div>
        ) : (
          <>
            <p>We couldn&apos;t find an exact match for your search.</p>
            {suggestedServices.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-2">Did you mean:</p>
                <div className="space-y-2">
                  {suggestedServices.map((service) => (
                    <Button
                      key={service}
                      variant="outline"
                      className="w-full text-left"
                      onClick={() => onServiceSelect(service)}
                    >
                      {service}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoMatchDialog;
