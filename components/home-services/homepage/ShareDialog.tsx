// components/share/ShareDialog.tsx
"use client";

import { Copy, Mail, Facebook, Twitter, Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner"; // or your preferred toast library

import {
  Dialog,
  DialogTrigger, // Make sure this is imported
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"; 
import { useState, useEffect } from "react";

export function ShareProfileDialog() {
  const pathname = usePathname();
  const [profileUrl, setProfileUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side
    setProfileUrl(`${window.location.origin}${pathname}`);
  }, [pathname]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link copied to clipboard!");
    setIsOpen(false);
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=Check out this professional profile&body=Here's a professional profile you might find interesting: ${profileUrl}`;
    setIsOpen(false);
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, '_blank');
    setIsOpen(false);
  };

  const shareViaTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=Check out this professional profile`, '_blank');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="mt-3 z-99 sm:mt-4 border border-gray-200 dark:border-gray-700 w-full sm:w-fit px-5 py-2 flex items-center justify-center sm:justify-start gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Share2 className="w-4 h-4"/>
          <p>Share</p>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="my-5">Share Profile</DialogTitle>
          
          {profileUrl && (
            <>
              {/* Copy Link */}
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors w-full text-left"
              >
                <Copy className="w-5 h-5 text-gray-500" />
                <span className="text-sm">Copy Share Link</span>
              </button>

              {/* Email */}
              <button 
                onClick={shareViaEmail}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors w-full text-left"
              >
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-sm">Share via Email</span>
              </button>

              {/* Facebook */}
              <button 
                onClick={shareViaFacebook}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors w-full text-left"
              >
                <Facebook className="w-5 h-5 text-gray-500" />
                <span className="text-sm">Share on Facebook</span>
              </button>

              {/* Twitter */}
              <button 
                onClick={shareViaTwitter}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors w-full text-left"
              >
                <Twitter className="w-5 h-5 text-gray-500" />
                <span className="text-sm">Share on Twitter</span>
              </button>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}