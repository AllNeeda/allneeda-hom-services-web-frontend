"use client";

import { useState } from "react";
import Service from "@/components/common/Service";
import { Service as TypeService } from "@/types/services";


export default function HomeSections({from,to,loadBtn = false ,title,services}:{from:number,to:number,loadBtn?:boolean ,title:string,services:TypeService[]}) {
  const [visibleCount, setVisibleCount] = useState(12);
  const itemsPerLoad = 12;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + itemsPerLoad, services.length));
  };

  const hasMoreItems = visibleCount < services.length;

  return (
    <div className=" px-4 py-6 ">
      <div className="max-w-7xl mx-auto ">
      <h1 className="text-2xl font-bold">{title}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-6 md:grid-cols-2 items-stretch">
          {services.slice(from, to).map((offer, idx) => (
            <Service key={idx} offer={offer as TypeService} />
          ))}
        </div>
        
        {hasMoreItems && loadBtn && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}