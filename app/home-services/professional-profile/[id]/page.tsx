"use client";

import {
  Check,
  HandCoins,
  Info,
  MessageCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Trophy,
  MapPin,
  UserCheck,
  Users,
  Clock9,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useMemo } from "react";
import { use } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ShareDialogWrapper from "@/components/home-services/homepage/ShareDialogWrapper";
import Breadcrumbs from "@/components/home-services/homepage/Breadcrumbs";

import QuestionModal from "@/components/home-services/homepage/QuestionModal";
import { useAutoTrackView } from "@/hooks/useAutoTrackView";

export default function ProfessionalProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  //   Count Professional View 
  const professional_id = id
  useAutoTrackView(professional_id);


  console.log(id);
  const [activeTab, setActiveTab] = useState<string>("about");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Refs for each section
  const aboutRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const credentialRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);

  const tabs = useMemo(
    () => [
      { id: "about", name: "About", ref: aboutRef },
      { id: "service", name: "Service", ref: serviceRef },
      { id: "photo", name: "Photos", ref: photosRef },
      { id: "credential", name: "Credentials", ref: credentialRef },
      { id: "reviews", name: "Reviews", ref: reviewsRef },
      { id: "faqs", name: "FAQs", ref: faqsRef },
    ],
    []
  );

  const portfolio_album = [
    { id: 1, file: "image", imageUrl: "/assets/home-service/service (1).jpg" },
    { id: 2, file: "image", imageUrl: "/assets/home-service/service (2).jpg" },
    { id: 3, file: "image", imageUrl: "/assets/home-service/service (3).jpg" },
    { id: 4, file: "image", imageUrl: "/assets/home-service/service (4).jpg" },
  ];

  const reviewStats = [
    { stars: 5, percentage: 87 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 2 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 0 },
  ];

  const scrollTo = (tabId: string) => {
    setActiveTab(tabId);
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.ref?.current) {
      tab.ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      tabs.forEach((tab) => {
        if (tab.ref?.current) {
          const element = tab.ref.current;
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveTab(tab.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tabs]);

  // Photo carousel controls
  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === portfolio_album.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? portfolio_album.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs
          paths={[
            { name: "Home", href: "/" },
            { name: "Home Services", href: "/home-services" },
            {
              name: "Professionals",
              href: "/home-services/professional-service/4",
            },
            { name: "Profile" },
          ]}
        />
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Main Content */}
          <div className="flex-1 p-2 sm:p-4 order-2 lg:order-1">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start mb-6 sm:mb-8">
              <div className="mx-auto sm:mx-0">
                <Image
                  src={"/assets/home-service/service (1).jpg"}
                  width={100}
                  height={100}
                  alt="Profile image"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border border-gray-200 dark:border-gray-800"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-bold">
                  Clark Construction Company
                </p>
                <div className="flex flex-row justify-start items-center sm:items-start gap-2">
                  <p className="text-sm font-bold text-emerald-500 dark:text-emerald-400">
                    Great 4.5
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 4
                          ? "fill-emerald-500 text-emerald-500"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">(24)</p>
                </div>
                <div className="flex flex-row justify-start items-center gap-2 mt-2">
                  <BadgeCheck className="w-6 h-6 fill-sky-500 text-yellow-500" />
                  <p className="text-sm text-gray-500">Top Pro</p>
                </div>
                <ShareDialogWrapper />
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-800 flex overflow-x-auto py-2 hide-scrollbar">
              <div className="flex space-x-6 min-w-max">
                {tabs.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`pb-2 px-1 relative whitespace-nowrap ${activeTab === item.id
                      ? "text-sky-500 dark:text-sky-400 font-medium"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      }`}
                  >
                    {item.name}
                    {activeTab === item.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 dark:bg-sky-400"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {/* About Section */}
              <div ref={aboutRef} className="space-y-4">
                <h3 className="text-md font-semibold">Inroduction</h3>
                <p className="text-gray-700 dark:text-gray-300 text-xs">
                  Clark Construction Company has been serving the community for
                  over 15 years with exceptional construction services. Our team
                  of certified professionals delivers quality workmanship on
                  every project.
                </p>
                <div className="flex flex-col md:flex-row w-full overflow-hidden">
                  {/* Overview Section */}
                  <div className="w-full md:w-2/3 p-6 flex-1">
                    <h2 className="text-sm font-bold text-gray-800 dark:text-gray-300 mb-4">
                      Overview
                    </h2>

                    <div className="space-y-6 text-xs">
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <BadgeCheck className="w-4 h-4 fill-sky-500 dark:fill-sky-400 dark:text-yellow-400 text-yellow-500" />
                          Current top professional service
                        </li>
                        <li className="flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          Hired 5432 times
                        </li>
                        <li className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Serves Fairfax, VA
                        </li>
                        <li className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          Background Checked
                        </li>
                        <li className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          65 Employees
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock9 className="w-4 h-4" />
                          34 years in business
                        </li>
                      </ul>

                      {/* Business Hours */}
                      <div className="border border-gray-200 rounded dark:border-gray-700 p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-200">
                          Business Hours
                        </h3>
                        <div className="flex flex-row">
                          <div className="w-full space-y-2 text-gray-600 font-medium">
                            <div>Sunday</div>
                            <div>Monday</div>
                            <div>Tuesday</div>
                            <div>Wednesday</div>
                            <div>Thursday</div>
                            <div>Friday</div>
                            <div>Saturday</div>
                          </div>
                          <div className="w-full space-y-2 text-gray-700 dark:text-gray-500">
                            <div className="text-red-500">Closed</div>
                            <div>05:00 AM - 11:30 PM</div>
                            <div>05:00 AM - 11:30 PM</div>
                            <div>05:00 AM - 11:30 PM</div>
                            <div>05:00 AM - 11:30 PM</div>
                            <div>05:00 AM - 11:30 PM</div>
                            <div className="text-red-500">Closed</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Section */}
                  <div className="w-full md:w-1/3 p-6 flex-1">
                    <h2 className="text-sm font-bold text-gray-800 mb-4 dark:text-gray-200">
                      Payment Methods
                    </h2>
                    <div className="space-y-4 text-xs">
                      <p>
                        This pro accepts payments via Apple Pay, Cash, Check,
                        Credit card, Square cash app, Venmo, and Zelle.
                      </p>
                    </div>
                    <div className="mt-8">
                      <p className="text-sm font-bold mb-4">Top Pro Status</p>
                      <p className="text-xs">
                        Top Pros are among the highest-rated, most popular
                        professionals on Servicyee.
                      </p>
                      <div className="flex flex-row gap-2 justify-start items-center flex-wrap">
                        <div className="flex flex-col justify-center items-center text-xs">
                          <BadgeCheck className="w-12 h-12 fill-sky-500 text-yellow-500" />
                          <p className="text-gray-500">2021</p>
                        </div>
                        <div className="flex flex-col justify-center items-center text-xs">
                          <BadgeCheck className="w-12 h-12 fill-sky-500 text-yellow-500" />
                          <p className="text-gray-500">2021</p>
                        </div>
                        <div className="flex flex-col justify-center items-center text-xs">
                          <BadgeCheck className="w-12 h-12 fill-sky-500 text-yellow-500" />
                          <p className="text-gray-500">2022</p>
                        </div>
                        <div className="flex flex-col justify-center items-center text-xs">
                          <BadgeCheck className="w-12 h-12 fill-sky-500 text-yellow-500" />
                          <p className="text-gray-500">2023</p>
                        </div>
                        <div className="flex flex-col justify-center items-center text-xs">
                          <BadgeCheck className="w-12 h-12 fill-sky-500 text-yellow-500" />
                          <p className="text-gray-500">2024</p>
                        </div>
                        <div className="flex flex-col justify-center items-center text-xs">
                          <BadgeCheck className="w-12 h-12 fill-sky-500 text-yellow-500" />
                          <p className="text-gray-500">2025</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-sm ">
                    Specializations:
                  </h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                    <li>Residential Construction</li>
                    <li>Commercial Renovations</li>
                    <li>Kitchen & Bath Remodeling</li>
                    <li>Custom Home Building</li>
                  </ul>
                </div>
                <div className="my-5">
                  <div className="flex flex-col sm:flex-row justify-center sm:justify-center items-center gap-3">
                    <Link
                      href={"/message"}
                      className="w-full sm:w-auto text-sky-500 flex gap-2 items-center justify-center border border-gray-500 active:border-sky-500 px-5 py-2 hover:border-sky-500 rounded"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <p>Message</p>
                    </Link>
                    <Link
                      href={"/message"}
                      className="w-full sm:w-auto text-sky-500 flex gap-2 items-center justify-center border border-gray-500 active:border-sky-500 px-5 py-2 hover:border-sky-500 rounded"
                    >
                      <HandCoins className="w-4 h-4" />
                      <p>Request Quotation</p>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div ref={serviceRef} className="space-y-4 mt-10">
                <h3 className="text-md font-semibold">Our Services</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                    <h4 className=" text-sm font-semibold">
                      New Home Construction
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Custom home building from foundation to finish.
                    </p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                    <h4 className=" text-sm font-semibold">
                      Kitchen Remodeling
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Complete kitchen renovations with modern designs.
                    </p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                    <h4 className=" text-sm font-semibold">
                      Bathroom Remodeling
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Luxury bathroom upgrades and renovations.
                    </p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                    <h4 className=" text-sm font-semibold">
                      Commercial Buildouts
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Office spaces and retail buildouts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Credentials Section */}
              <div ref={credentialRef} className="space-y-4 mt-10">
                <h3 className="text-md font-semibold">
                  Credentials & Certifications
                </h3>
                <div className="mt-4 space-y-4 tex-xs">
                  <div>
                    <h4 className=" text-sm font-semibold">
                      Licenses
                    </h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                      <li>State Licensed General Contractor (#GC123456)</li>
                      <li>Certified Lead-Safe Renovator</li>
                      <li>OSHA 30-Hour Certified</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className=" text-sm font-semibold">
                      Insurance
                    </h4>
                    <p className="mt-1 text-gray-700 dark:text-gray-300 text-xs">
                      Fully insured with $2,000,000 general liability coverage.
                    </p>
                  </div>
                  <div>
                    <h4 className=" text-sm font-semibold">
                      Associations
                    </h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                      <li>National Association of Home Builders (NAHB)</li>
                      <li>Local Chamber of Commerce</li>
                      <li>Better Business Bureau (A+ Rating)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Other Sections */}
              <div className="mt-5">
                <p className="text-sm font-semibold">Services Offered</p>
                <p className="mt-4 text-xs font-bold">[Service] Type</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-full text-sky-500">
                    Standard Cleaning
                  </span>
                  <span className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-full text-sky-500">
                    Deep Cleaning
                  </span>
                  <span className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-full text-sky-500">
                    Moving out Cleaning
                  </span>
                  <span className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-full text-sky-500">
                    Vacation rental Cleaning
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold">Extra Services</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" />
                      <p className="text-gray-700 dark:text-gray-400">
                        Interior window cleaning
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" />
                      <p className="text-gray-700 dark:text-gray-400">
                        Oven cleaning
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" />
                      <p className="text-gray-700 dark:text-gray-400">
                        Fridge cleaning
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" />
                      <p className="text-gray-700 dark:text-gray-400">
                        Laundry
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 dark:border-gray-700">
                  <p className="text-sm font-semibold">Pets</p>
                  <div className="flex justify-start items-center gap-2 text-xs">
                    <Check className="w-4 h-4 text-green-500" />
                    <p className="text-gray-700 dark:text-gray-400">
                      House with pets
                    </p>
                  </div>
                </div>
              </div>
              {/* project and media for photos section */}
              <div ref={photosRef} className="space-y-4 mt-10">
                <div className="">
                  <p className="text-md font-semibold">Projects and Media</p>
                  <p className="text-xs text-gray-500">
                    {portfolio_album.length} photos
                  </p>
                </div>

                <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                  {/* Current Photo */}
                  <Image
                    src={portfolio_album[currentPhotoIndex].imageUrl}
                    alt={`Project photo ${currentPhotoIndex + 1}`}
                    fill
                    className="object-cover transition-opacity duration-500"
                    priority
                  />

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Photo Indicators */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {portfolio_album.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentPhotoIndex
                          ? "bg-white w-4"
                          : "bg-white/50"
                          }`}
                        aria-label={`Go to photo ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {portfolio_album.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`relative h-20 rounded-md overflow-hidden transition-all ${index === currentPhotoIndex ? "ring-2 ring-sky-500" : ""
                        }`}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
                {/* Reviews Section with Enhanced Progress Bars */}
                <div ref={reviewsRef} className="space-y-4 mt-10">
                  <div className="">
                    <p className="text-md font-semibold">Reviews</p>
                    <p className="text-xs text-gray-800 dark:text-gray-300">
                      Customers consistently praised this professional for their{" "}
                      <b>work quality</b>, <b>professionalism</b>, and{" "}
                      <b>responsiveness</b>.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center sm:items-start">
                      <p className="text-3xl font-bold text-emerald-500 dark:text-emerald-400">
                        Great 4.5
                      </p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < 4
                              ? "fill-emerald-500 text-emerald-500"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Based on 24 reviews
                      </p>
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      {reviewStats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex items-center w-8">
                            <span className="text-xs text-gray-500">
                              {stat.stars}
                            </span>
                            <Star className="w-4 h-4 fill-gray-200 text-gray-200 ml-1" />
                          </div>
                          <div className="relative flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${stat.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-10 text-right">
                            {stat.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-800 dark:text-gray-300">
                    Your trust means everything to us.{" "}
                    <Link
                      href={"/guidelines"}
                      className="font-bold text-sky-500"
                    >
                      Learn about our review guidelines.
                    </Link>
                  </p>
                </div>
              </div>

              {/* Credentials */}
              <div className="my-4 border-t border-gray-200 mt-10 pt-5">
                <div className="flex justify-start items-center gap-2">
                  <p className="text-lg font-bold">Credentials</p>
                  <Info className="w-4 h-4 text-gray-400 font-bold" />
                </div>
                <div className="flex justify-start items-center gap-2">
                  <p className="text-sm font-semibold">Background Check</p>
                  <Check className="w-4 h-4 text-gray-800 dark:text-gray-400" />
                </div>
                <p className="text-xs font-medium py-1 mb-4">
                  Brand Construction Company
                </p>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-sky-500 font-bold text-xs cursor-pointer hover:underline focus-visible:outline-none">
                      View Credential Details
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                    <DialogHeader>
                      <DialogTitle>Credential Details</DialogTitle>
                      <DialogDescription className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Background Check
                      </DialogDescription>
                    </DialogHeader>
                    <div className="text-sm mt-2">Completed on 04/08/2024</div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="">
              <p className="text-md font-semibold">FAQs</p>
              <div className="text-sm mt-5 space-y-4">
                <div className="">
                  <p className="font-semibold">1. What is Lorem Ipsum?</p>
                  <p className="text-xs">
                    It was popularised in the 1960s with the release of Letraset
                    sheets containing Lorem Ipsum passages, and more recently
                    with desktop publishing software like Aldus PageMaker
                    including versions of Lorem Ipsum.
                  </p>
                </div>
                <div className="">
                  <p className="font-semibold">2. What is Lorem Ipsum?</p>
                  <p className="text-xs">
                    It was popularised in the 1960s with the release of Letraset
                    sheets containing Lorem Ipsum passages, and more recently
                    with desktop publishing software like Aldus PageMaker
                    including versions of Lorem Ipsum.
                  </p>
                </div>
                <div className="">
                  <p className="font-semibold">3. What is Lorem Ipsum?</p>
                  <p className="text-xs">
                    It was popularised in the 1960s with the release of Letraset
                    sheets containing Lorem Ipsum passages, and more recently
                    with desktop publishing software like Aldus PageMaker
                    including versions of Lorem Ipsum.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 p-2 sm:p-4 order-1 lg:order-2">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded overflow-hidden pb-6 lg:sticky lg:top-4">
              <div className="bg-sky-500 p-1 dark:bg-sky-400"></div>
              <div className="p-4 space-y-1 flex flex-col">
                <MessageCircle className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                <QuestionModal />
                <Link
                  href={"/view-details"}
                  className="text-xs text-sky-500 dark:text-sky-400"
                >
                  View Details
                </Link>
              </div>

              <div className="p-4 text-center">
                <QuestionModal
                  triggerText="Request Quotation"
                  triggerClassName="bg-sky-500 dark:bg-sky-400 px-4 py-2 text-white rounded hover:bg-sky-600 dark:hover:bg-sky-500 transition-colors"
                />
              </div>
              <div className="flex flex-row gap-2 justify-center items-center text-xs text-green-500 mt-4">
                <span className="relative flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                </span>
                <p>Online Now</p>
              </div>
            </div>
            <div className="bg-slate-100 my-4 rounded p-4 dark:bg-slate-800">
              <p className="text-md font-bold text-sky-500 dark:text-sky-400">
                Servicyee Guarantee
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-500 mt-1">
                If you hire this pro, you&apos;re covered by a money-back
                guarantee.
                <Link href={"/guarantee"} className="text-sky-500 ml-1">
                  Learn more
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
