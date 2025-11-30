import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ThemeProvider } from "@/components/providers/theme/theme-provider";

interface AdminRootLayoutProps {
  children: React.ReactNode;
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AdminLayout>{children}</AdminLayout>
    </ThemeProvider>
  );
}
