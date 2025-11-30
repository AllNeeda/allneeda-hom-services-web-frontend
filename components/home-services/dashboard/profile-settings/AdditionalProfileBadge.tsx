"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const AdditionalProfileBadge = () => {
  const [showTip, setShowTip] = useState(false);
  const handleDiscount = () => {
    showTip ? setShowTip(false) : setShowTip(true);
  };
  const EditIntro = "edit-intro";
  return (
    <div className="rounded bg-white dark:bg-gray-800 p-4 my-4">
      <div className="border border-gray-200 dark:border-gray-700 p-4">
        <h1 className="font-bold text-lg">Additional Profile Badge</h1>
        <div className="flex flex-row gap-2 items-center justify-start mt-5">
          <DollarSign className="w-4 h-4" />
          <p className="font-semibold">Are you offering discounts?</p>
        </div>
        <p className="text-sm">
          Customers will see this in search results, but it&apos;s up to you to
          work out final prices.
        </p>
        <Checkbox
          id="offer"
          className="my-4 mr-2 data-[state=checked]:border-sky-600 data-[state=checked]:bg-sky-600 data-[state=checked]:text-white dark:data-[state=checked]:border-sky-700 dark:data-[state=checked]:bg-sky-700"
          onCheckedChange={handleDiscount}
        />
        <label htmlFor="offer">I am offering discounts</label>
        {showTip && (
          <p className="text-sm">
            <strong>Tip</strong>: You can add more specifics in your
            introduction.{" "}
            <Link
              href={`/home-services/dashboard/profile-settings/${EditIntro}`}
              className="text-sky-500"
            >
              Update your introduction.
            </Link>
          </p>
        )}
        {/* remote consultant */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-5 py-5">
          <div className="flex flex-row gap-2 items-center justify-startborder-t border-gray-200 dark:border-gray-700">
            <Video className="w-4 h-4" />
            <p className="font-semibold">
              Are you offering remote services or consultations?
            </p>
          </div>
          <p className="text-sm">
            We&apos;ll let customers know you can work with them online or over
            the phone.
          </p>
          <Checkbox
            id="offer"
            className="my-4 mr-2 data-[state=checked]:border-sky-600 data-[state=checked]:bg-sky-600 data-[state=checked]:text-white dark:data-[state=checked]:border-sky-700 dark:data-[state=checked]:bg-sky-700"
            onCheckedChange={handleDiscount}
          />
          <label htmlFor="offer">
            I am offering remote services or consultations
          </label>
          <p className="text-sm">
            <strong>Note: </strong> This badge is only visible for services
            where remote work is possible.
          </p>
        </div>
      </div>
    </div>
  );
};
export default AdditionalProfileBadge;
