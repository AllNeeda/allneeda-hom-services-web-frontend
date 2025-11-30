'use client'
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Service as TypeService} from "@/types/services";
import { Heart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const Service = ({offer}: {offer: TypeService}) =>{
  const [isFavorite, setIsFavorite] = useState(false);
    return <Card  className="relative dark:bg-gray-800 flex-col h-full  border-none shadow-none group overflow-hidden">
    {/* Badge and Favorite */}
    <div className="absolute top-6 left-5 z-10 flex items-center gap-2">
      <Badge variant="destructive" className="text-xs font-semibold px-3 py-1 ">{offer.badge}</Badge>
    </div>
    <div className="absolute top-5 right-5 z-10">
      <Button onClick={()=>setIsFavorite(!isFavorite)} variant="ghost" size="icon" className="bg-white/80 rounded-full cursor-pointer p-2 hover:bg-gray-200 transition">
        <Heart className="h-4 w-4 text-[#D36582]" fill={isFavorite ? "currentColor" : "none"} />
      </Button>
    </div>
    {/* Image */}
    <div className="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer">
      <Link href={"/service-details-slug"}>
      <Image src={offer.image} alt={offer.title} width={400} height={160} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
      </Link>
    </div>
    {/* Content */}
    <CardContent className="flex-1 flex flex-col px-0">
      <div className="text-xs font-semibold mb-1 min-h-[16px]">{offer.subtitle}</div>
      <CardTitle className="text-base font-bold mb-1 leading-tight min-h-[40px] cursor-pointer">
        <Link href={"/service-details-slug"}>
        {offer.title}</Link>
      </CardTitle>
      {offer.address && (
        <div className="text-xs flex items-center gap-2 mb-1 min-h-[16px]">
          <span>{offer.address}</span>
          {offer.distance && (
            <span className="flex items-center gap-1">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              {offer.distance}
            </span>
          )}
        </div>
      )}
      {!offer.address && <div className="min-h-[16px] mb-1"></div>}
      {/* Price and Discount */}
      <div className="flex items-end gap-2 mt-2 min-h-[24px]">
        <span className="text-sm line-through">{offer.oldPrice}</span>
        <span className={`text-lg font-bold ${offer.priceColor}`}>{offer.newPrice}</span>
        <span className={`text-xs font-semibold ${offer.discountColor}`}>-{offer.discount}</span>
        {offer.promo && (
          <span className={`ml-2 text-xs font-semibold ${offer.promoColor}`}>{offer.promo.price} <span className="ml-1">with code {offer.promo.code}</span></span>
        )}
      </div>
      {/* Rating */}
      <div className="flex items-center gap-1 mt-2 text-sm min-h-[20px]">
        <span className={offer.ratingColor}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
        </span>
        <span className="font-semibold">{offer.rating}</span>
        <span>({offer.reviews.toLocaleString()})</span>
      </div>
      {/* See More Button */}
      <Button variant="link" size="sm" className="mt-auto w-fit px-0 text-blue-700" asChild>
        <a href="#">See More &rarr;</a>
      </Button>
    </CardContent>
  </Card>
}
export default Service;