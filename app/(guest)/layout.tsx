import React from "react";
import Footer from "@/components/navigation/Footer";
import Header from "@/components/navigation/header";

export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white dark:bg-gray-950">
         <Header />
          {children}
          <Footer />
    </div>
  );
}
