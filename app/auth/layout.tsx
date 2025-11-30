import Footer from "@/components/navigation/Footer";
import Header from "@/components/navigation/header/index";
import React from "react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Header/>
      {children}
      <Footer/>
    </div>
  );
}
