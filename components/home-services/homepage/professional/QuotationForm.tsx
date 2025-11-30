"use client";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input"; // Adjust the import path as needed
import { Textarea } from "@/components/ui/textarea"; // You'll need a similar Textarea component

export default function QuotationForm() {
  return (
    <div
      className={`flex-1 w-full p-4 rounded-lg shadow-md transition-colors duration-300 dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200 border`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-bold mb-4">Request Quotation</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="service" className="block text-sm font-medium mb-1">
              Service
            </label>
            <Input type="text" id="service" value="House Cleaning" readOnly />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium mb-1"
            >
              Location
            </label>
            <Input type="text" id="location" value="Chicago, IL" readOnly />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Preferred Date
            </label>
            <Input type="date" id="date" />
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium mb-1">
              Additional Details
            </label>
            <Textarea
              id="details"
              rows={3}
              placeholder="Any special requirements..."
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-2 rounded font-medium transition-colors dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-500 hover:bg-sky-600 text-white`}
          >
            Request Quotation
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
