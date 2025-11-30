"use client";
import { Calendar, Wrench, Monitor, BarChart, Check } from "lucide-react";
import { motion } from "framer-motion";

const tools = [
  {
    name: "Housecall Pro",
    description:
      "Turn leads from Servicyee into jobs, and manage all your projects with Housecall Pro. Oversee the entire job lifecycle, from scheduling to invoicing to payment.",
    button: "Connect to Housecall Pro",
    icon: <Wrench className="w-5 h-5 text-[#0077B6]" />,
    connected: true,
  },
  {
    name: "GoSite",
    description:
      "Affordable, easy-to-use tech helps pros respond faster to Servicyee messages, streamline scheduling, and manage multiple lead platform calendars from one place.",
    button: "Connect to GoSite",
    icon: <Monitor className="w-5 h-5 text-[#0077B6]" />,
    connected: false,
  },
  {
    name: "ServiceTitan",
    description:
      "Keep your business on-track by connecting to ServiceTitan. With powerful reporting and real-time data, everything you need is in one convenient location.",
    button: "Connect to ServiceTitan",
    icon: <BarChart className="w-5 h-5 text-[#0077B6]" />,
    connected: false,
  },
  {
    name: "Google Calendar",
    description:
      "Sync your appointments and scheduling seamlessly with Google Calendar. Stay organized and never miss a booking.",
    button: "Connect to Google Calendar",
    icon: <Calendar className="w-5 h-5 text-[#0077B6]" />,
    connected: true,
  },
];

export default function IntegrationsPage() {
  return (
    <div className="dark:bg-[#03045E] transition-colors duration-300 flex flex-col items-center px-4 py-12">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#023E8A] dark:text-[#CAF0F8]">
              Connect your tools to{" "}
              <span className="text-[#0077B6] dark:text-[#48CAE4]">
                Servicyee
              </span>
            </h1>
            <p className="mt-2 text-[13px] text-gray-600 dark:text-[#ADE8F4] leading-snug max-w-xl">
              Manage your bookings more easily, simplify your workflow, and get
              more jobs done. Connect to your favorite partner tools and
              services.
            </p>
          </div>
        </div>

        {/* Integration cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((tool, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-[#023E8A] rounded-md shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-between border border-[#90E0EF]/40 dark:border-[#48CAE4]/30 relative overflow-hidden group"
            >
              {/* Connection badge */}
              {tool.connected && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#90E0EF] dark:bg-[#48CAE4]/30 text-[#023E8A] dark:text-[#48CAE4] text-[11px] font-medium px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                  Connected
                </div>
              )}

              {/* Background effect */}
              <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-[#ADE8F4] group-hover:bg-[#90E0EF] transition-colors duration-300"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-[#CAF0F8] dark:bg-[#0096C7]/30 rounded-md">
                    {tool.icon}
                  </div>
                  <h2 className="text-[15px] font-semibold text-[#03045E] dark:text-white">
                    {tool.name}
                  </h2>
                </div>
                <p className="text-[13px] text-gray-600 dark:text-[#CAF0F8] mb-4 leading-snug">
                  {tool.description}
                </p>
              </div>

              <button
                className={`w-full relative z-10 font-medium py-2 px-3 text-[13px] rounded-md transition-all flex items-center justify-center ${
                  tool.connected
                    ? "bg-[#90E0EF] dark:bg-[#48CAE4]/30 text-[#023E8A] dark:text-[#48CAE4] hover:bg-[#48CAE4] hover:text-white"
                    : "bg-[#0077B6] hover:bg-[#0096C7] text-white"
                }`}
              >
                {tool.connected ? "Manage Connection" : tool.button}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Request integration section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-[#CAF0F8] to-[#ADE8F4] dark:from-[#023E8A] dark:to-[#03045E] p-4 rounded-lg border border-[#90E0EF] dark:border-[#48CAE4]/40"
        >
          <h3 className="text-[15px] font-semibold text-[#03045E] dark:text-white mb-2">
            Need a different integration?
          </h3>
          <p className="text-[13px] text-gray-600 dark:text-[#CAF0F8] mb-3 leading-snug">
            We are constantly expanding our integration offerings. Let us know
            which tools you would like to connect with Servicyee.
          </p>
          <button className="bg-[#0077B6] hover:bg-[#0096C7] text-white dark:bg-[#48CAE4] dark:hover:bg-[#90E0EF] dark:text-[#023E8A] text-[13px] font-medium py-2 px-3 rounded-md transition border border-transparent">
            Request Integration
          </button>
        </motion.div>
      </div>
    </div>
  );
}
