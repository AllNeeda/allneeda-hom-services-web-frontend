import { Briefcase, Mail, Settings, Layers, LayoutDashboard, ChartCandlestick  } from "lucide-react";
import React from "react"; // <--- Required for using JSX in objects (icons)

export type SubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
};

export type NavItem = {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  subItems?: SubItem[];
};



export const serviceProviderNavItems: NavItem[] = [
  { name: "Dashboard", path: "/home-services/dashboard/main", icon: <LayoutDashboard  size={18} /> },
  { name: "My Services", path: "/home-services/dashboard/services", icon: <Layers size={18} /> },
  { name: "Leads", path: "/home-services/dashboard/leads", icon: <Briefcase size={18} /> },
  { name: "Inbox", path: "/home-services/dashboard/inbox", icon: <Mail size={18} /> },
  { name: "Performance", path: "/home-services/dashboard/profile", icon: <Settings size={18} /> },
  { name: "Marketing", path: "/home-services/dashboard/marketing", icon: <ChartCandlestick size={18} /> },


];
