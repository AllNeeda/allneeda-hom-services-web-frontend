"use client";

import { motion } from "framer-motion";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Minimal spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear"
          }}
          className="h-12 w-12 rounded-full border-3 border-muted-foreground/30 border-t-foreground"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground font-medium tracking-wide"
        >
          Loading...
        </motion.div>
      </div>
    </div>
  );
}