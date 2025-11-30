
import Footer from "@/components/navigation/Footer";
import Header from "@/components/navigation/header";
import { Header as ITServiceHeader} from "@/components/it-services/navigations/header"
import React from "react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Header />
      <ITServiceHeader />
      {children}
      <Footer />
    </div>
  );
}
