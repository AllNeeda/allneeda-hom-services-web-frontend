"use client";
import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function LocationPermissionModal({
  open,
  onAccept,
  onDecline,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onDecline}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-96 mx-auto z-50">
        <Dialog.Title className="text-lg font-semibold mb-2 text-center">
          Allow Location Access
        </Dialog.Title>
        <Dialog.Description className="text-gray-500 dark:text-gray-300 mb-4 text-center">
          We use your location to show services near you. Would you like to
          allow access?
        </Dialog.Description>
        <div className="flex justify-center gap-4">
          <Button onClick={onAccept}>Allow</Button>
          <Button variant="outline" onClick={onDecline}>
            No, thanks
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
