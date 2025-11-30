"use client";

import { marketPlaceServices} from "@/data/dummy";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTabs } from "@/components/ui/custom-tab";
import Service from "@/components/common/Service";


export default function MarketPlaceSection() {
  const tabs = [
    { value: "featured", label: "Featured Deals", color: "blue" },
    { value: "premium", label: "Premium Services", color: "purple" },
    { value: "hot", label: "Hot Offers", color: "green" },
    { value: "new", label: "New Arrivals", color: "orange" }
  ];

  const tabServices = marketPlaceServices;

  return (
    <section className="py-16 bg-gradient-to-br ">
      <div className="max-w-7xl mx-auto ">
       

        {/* Tabs Section */}
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r ">
            <CardTitle className="text-2xl">Market Place</CardTitle>
            <CardDescription className="">
              Marketplace offers and premium services are currently available only in the UAE.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="px-6">
                <CustomTabs
                 tabList={tabs.map(tab => ({ key: tab.value, label: tab.label }))}
                 tabContent={{
                   featured: (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div className="lg:col-span-3">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {tabServices.slice(0, 6).map((service, index) => (
                             <Service key={index} offer={service} />
                           ))}
                         </div>
                       </div>
                     </div>
                   ),
                   premium: (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div className="lg:col-span-3">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {tabServices.slice(6, 12).map((service, index) => (
                             <Service key={index} offer={service} />
                           ))}
                         </div>
                       </div>
                     </div>
                   ),
                   hot: (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div className="lg:col-span-3">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {tabServices.slice(12, 18).map((service, index) => (
                             <Service key={index} offer={service} />
                           ))}
                         </div>
                       </div>
                     </div>
                   ),
                   new: (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div className="lg:col-span-3">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {tabServices.slice(18, 24).map((service, index) => (
                             <Service key={index} offer={service} />
                           ))}
                         </div>
                       </div>
                     </div>
                   )
                 }}
               />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}