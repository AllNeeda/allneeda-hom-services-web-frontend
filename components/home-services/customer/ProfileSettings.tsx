"use client";
import { Settings, Bell, LogOut, PowerOff, Key } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EditAccount from "./EditAccount";
import EditNotification from "./EditNotification";
import DeactivateAccount from "./DeactivateAccount";
import ChangePassword from "./ChangePassword";

// interface CustomerType {
//   id: number;
//   first_name: string;
//   last_name: string;
//   email: string;
//   profile: string;
//   phone: string;
//   reviews: number;
//   project: number;
// }

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const customer = {
    id: 2,
    first_name: "Esmatullh",
    last_name: "Hashhimi",
    email: "esmatullah.hashimi@gmail.com",
    profile: "/service_profile.jpg",
    phone: "0748631879",
    reviews: 345,
    project: 9,
  };

  const tabs = [
    { title: "Account Settings", Icon: Settings, slug: "account" },
    { title: "Notification Settings", Icon: Bell, slug: "notification" },
    { title: "Deactivate Account", Icon: PowerOff, slug: "deactivate" },
    { title: "Change Password", Icon: Key, slug: "changePassword" },
  ];

  return (
    <>
      <div className="bg-white rounded dark:bg-gray-800 dark:text-gray-300">
        {/* Tabs container */}
        <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 sm:gap-4 text-sm overflow-x-auto">
          {tabs.map((tab, index) => (
            <div
              key={index}
              onClick={() => setActiveTab(tab.slug)}
              className={`flex flex-row gap-1 items-center p-3 sm:p-4 border-b-2 cursor-pointer whitespace-nowrap
              ${
                activeTab === tab.slug
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent hover:border-sky-500 dark:border-gray-800"
              }`}
            >
              <tab.Icon className="w-4 h-4 shrink-0" />
              <Link href="#" className="text-xs">
                {tab.title}
              </Link>
            </div>
          ))}
          {/* Logout */}
          <div className="flex flex-row gap-2 items-center p-3 sm:p-4 border-b-2 border-transparent dark:border-gray-800 cursor-pointer hover:border-sky-500 hover:text-sky-500 whitespace-nowrap">
            <LogOut className="w-4 h-4 shrink-0" />
            <Link href="/home-services">Logout</Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 px-2 sm:px-4">
        {activeTab === "account" && <EditAccount customer={customer} />}
        {activeTab === "notification" && <EditNotification />}
        {activeTab === "deactivate" && <DeactivateAccount />}
        {activeTab === "changePassword" && <ChangePassword />}
      </div>
    </>
  );
};

export default ProfileSettings;
