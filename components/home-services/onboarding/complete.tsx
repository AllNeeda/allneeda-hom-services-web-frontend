'use client';

import { useState, useMemo, useCallback } from 'react';
import { Loader2, MapPin, Clock, Star, Users, Calendar, Award, Building } from 'lucide-react';
import { useProfessionalReview } from '@/hooks/RegisterPro/useRegister';
import { getAccessToken } from '@/app/api/axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import GlobalLoader from '@/components/ui/global-loader';

// Memoized components to prevent unnecessary re-renders
const ProfileImage = ({ profileImage, name, Backend_URL }: { profileImage: string; name: string; Backend_URL: string }) => (
  profileImage ? (
    <Image
      src={`${Backend_URL}/uploads/professionals/${profileImage}`}
      alt={name}
      width={80}
      height={80}
      priority
      className="rounded-sm object-cover border-2 border-white dark:border-gray-800 w-16 h-16 sm:w-20 sm:h-20"
    />
  ) : (
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-sm bg-gradient-to-br from-[#0077B6] to-[#48CAE4] flex items-center justify-center border-2 border-white dark:border-gray-800">
      <span className="text-lg font-bold text-white">
        {name?.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
);

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating)
          ? 'text-yellow-400 fill-current'
          : 'text-gray-300 dark:text-gray-800'
          }`}
      />
    ))}
  </div>
);

const StatCard = ({ stat }: { stat: any }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-sm p-3">
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-sm bg-gray-50 dark:bg-gray-700 ${stat.color}`}>
        <stat.icon className="w-3 h-3" />
      </div>
      <div className="min-w-0">
        <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
          {stat.value}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {stat.label}
        </div>
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <GlobalLoader></GlobalLoader>
);

const ProfessionalProfile = () => {
  const router = useRouter();
  const Backend_URL = process.env.NEXT_PUBLIC_API_BASE_MEDIA || 'http://localhost:4000';
  const token = useMemo(() => getAccessToken() || "", []);
  const { data } = useProfessionalReview(token);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const handleNext = useCallback(async () => {
    setIsLoading(true);
    try {
      toast.success('Profile completed successfully!', {
        duration: 3000,
        position: 'top-right'
      });
      router.push("/home-services/dashboard/main");
    } catch {
      setIsLoading(false);
      toast.error('Confirmation failed. Please try again.');
    }
  }, [router]);

  const processedData = useMemo(() => {
    if (!data || !data.professional) return null;

    const professional = data.professional;
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const businessAddress = professional.locations?.find((loc: any) => loc.type === 'professional') || professional.locations?.[0];
    const serviceLocations = professional.locations?.filter((loc: any) => loc !== businessAddress) || [];
    const businessHours = professional.professional.business_hours?.map((day: any) => ({
      ...day,
      dayName: daysOfWeek[day.day]
    })) || [];

    const profileData = {
      name: professional.professional.business_name || "N/A",
      businessType: professional.professional.business_type || "N/A",
      foundedYear: professional.professional.founded_year,
      employees: professional.professional.employees || 0,
      rating: professional.professional.rating_avg || 0,
      reviews: professional.professional.total_review || 0,
      hires: professional.professional.total_hire || 0,
      about: professional.professional.introduction !== "NA" ? professional.professional.introduction : "No introduction provided.",
      profileImage: professional.professional.profile_image,
      timezone: professional.professional.timezone,
      services: professional.services?.map((service: any) => ({
        id: service._id,
        name: service.service_name || "Service Name", // Use service_name directly
        pricingType: service.pricing_type,
        questions: service.answered_questions?.filter((q: any) => q.answer) || []
      })) || []
    };

    const stats = [
      { icon: Users, label: "Clients Served", value: profileData.hires, color: "text-[#0077b6]" },
      { icon: Star, label: "Rating", value: profileData.rating, color: "text-yellow-500" },
      { icon: Calendar, label: "Years Experience", value: new Date().getFullYear() - (profileData.foundedYear || new Date().getFullYear()), color: "text-[#0077b6]" },
      { icon: Building, label: "Team Size", value: profileData.employees, color: "text-purple-600" }
    ];

    const tabs = [
      { id: 'overview', label: 'Overview', icon: Building },
      { id: 'services', label: 'Services', icon: Award },
      { id: 'locations', label: 'Locations', icon: MapPin },
      { id: 'hours', label: 'Business Hours', icon: Clock },
      { id: 'reviews', label: 'Reviews', icon: Star }
    ];

    return {
      professional,
      businessAddress,
      serviceLocations,
      businessHours,
      profileData,
      stats,
      tabs,
      reviewsData: professional.reviews || [] // Include reviews data
    };
  }, [data]);

  if (!processedData) {
    return <LoadingSpinner />;
  }

  const { businessAddress, serviceLocations, businessHours, profileData, stats, tabs, reviewsData } = processedData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="relative flex-shrink-0">
                  <ProfileImage
                    profileImage={profileData.profileImage}
                    name={profileData.name}
                    Backend_URL={Backend_URL}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                      {profileData.name}
                    </h1>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full w-fit">
                      {profileData.businessType}
                    </span>
                  </div>

                  <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-gray-800 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-1 text-xs">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{businessAddress?.city || 'N/A'}, {businessAddress?.state || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Building className="w-3 h-3 flex-shrink-0" />
                      <span>Est. {profileData.foundedYear}</span>
                    </div>
                  </div>

                  <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
                    <div className="flex items-center gap-1">
                      <RatingStars rating={profileData.rating} />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {profileData.rating} ({profileData.reviews} reviews)
                      </span>
                    </div>

                    <div className="hidden xs:block h-3 w-px bg-gray-300 dark:bg-gray-600"></div>

                    <div className="text-xs text-gray-800 dark:text-gray-400">
                      {profileData.services.length} services available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="pb-4 sm:pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-4 sm:space-x-8 px-3 sm:px-4 lg:px-6 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 border-b-2 transition-all duration-200 whitespace-nowrap text-xs font-medium flex-shrink-0 ${activeTab === tab.id
                  ? 'border-[#0077B6] text-[#0077B6] dark:text-[#48CAE4] dark:border-[#48CAE4]'
                  : 'border-transparent text-gray-900 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <OverviewTab
            profileData={profileData}
            businessAddress={businessAddress}
            businessHours={businessHours}
            setActiveTab={setActiveTab}
          />
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <ServicesTab services={profileData.services} />
        )}

        {/* Locations Tab */}
        {activeTab === 'locations' && (
          <LocationsTab
            businessAddress={businessAddress}
            serviceLocations={serviceLocations}
          />
        )}

        {/* Business Hours Tab */}
        {activeTab === 'hours' && (
          <BusinessHoursTab
            businessHours={businessHours}
            timezone={profileData.timezone}
          />
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <ReviewsTab
            reviews={reviewsData}
            rating={profileData.rating}
            totalReviews={profileData.reviews}
          />
        )}
      </div>

      {/* Save Button */}
      <div className="dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex justify-end">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleNext}
              className={`px-6 sm:px-8 py-2 rounded-sm transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center ${isLoading
                ? 'bg-[#0077B6]/70 cursor-not-allowed text-white'
                : 'bg-[#0077B6] hover:bg-[#005f8e] text-white'
                }`}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tab Components for better code organization
const OverviewTab = ({ profileData, businessAddress, businessHours, setActiveTab }: any) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
    {/* Left Column */}
    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
      {/* About Section */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Business Introduction</h2>
        <p className="text-gray-900 dark:text-gray-300 leading-relaxed text-justify text-sm sm:text-[13px]">
          {profileData.about}
        </p>
      </div>

      {/* Services Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Services</h2>
          <button
            onClick={() => setActiveTab('services')}
            className="text-[#0077B6] dark:text-[#48CAE4] hover:text-[#005f8e] dark:hover:text-[#0096C7] font-medium text-sm"
          >
            View All
          </button>
        </div>

        <div className=" sm:grid-cols-2 gap-3 sm:gap-4">
          {profileData.services.slice(0, 4).map((service: any) => (
            <div key={service.id} className="space-y-2">
              <ServicePreviewCard service={service} />
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center">
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Right Column */}
    <div className="space-y-4 sm:space-y-6">
      <BusinessAddressCard businessAddress={businessAddress} />
      <BusinessHoursPreview businessHours={businessHours} setActiveTab={setActiveTab} />
    </div>
  </div>
);

const ServicePreviewCard = ({ service }: any) => (
  <div className="border border-gray-200 dark:border-gray-600 rounded-sm p-3 sm:p-4 hover:border-[#0077B6] dark:hover:border-[#48CAE4] transition-all duration-200 group">
    <div className="flex items-start justify-between mb-2">
      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#0077B6] dark:group-hover:text-[#48CAE4] text-sm truncate max-w-[70%]">
        {service.name}
      </h3>
      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#0077b6] dark:text-[#0077b6] text-xs font-medium rounded flex-shrink-0">
        {service.pricingType}
      </span>
    </div>
    <p className="text-gray-500 dark:text-gray-400 text-sm">
      {service.questions.length} questions answered
    </p>
  </div>
);

const BusinessAddressCard = ({ businessAddress }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm">
      <MapPin className="w-4 h-4 text-[#0077B6] dark:text-[#48CAE4]" />
      Business Address
    </h3>
    <div className="space-y-2 text-sm text-gray-800 dark:text-gray-300 mb-3 sm:mb-4">
      <p className="break-words">{businessAddress?.address_line}, {businessAddress?.city}, {businessAddress?.state}, {businessAddress?.country}, {businessAddress?.zipcode}</p>
    </div>
    <div className="h-24 sm:h-32 bg-gray-100 dark:bg-gray-700 rounded-sm flex items-center justify-center">
      <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
    </div>
  </div>
);

const BusinessHoursPreview = ({ businessHours, setActiveTab }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm">
      <Clock className="w-4 h-4 text-[#0077B6] dark:text-[#48CAE4]" />
      Business Hours
    </h3>
    <div className="space-y-2">
      {businessHours.slice(0, 3).map((day: any) => (
        <div key={day.day} className="flex justify-between items-center text-sm">
          <span className="text-gray-700 dark:text-gray-300">{day.dayName.slice(0, 3)}</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {day.status === 'open'
              ? `${new Date(day.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${new Date(day.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
              : 'Closed'
            }
          </span>
        </div>
      ))}
    </div>
    <button
      onClick={() => setActiveTab('hours')}
      className="w-full mt-3 text-[#0077B6] dark:text-[#48CAE4] hover:text-[#005f8e] dark:hover:text-[#0096C7] font-medium text-sm text-center pt-2 border-t border-gray-200 dark:border-gray-600"
    >
      View All Hours
    </button>
  </div>
);

const ServicesTab = ({ services }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Our Services</h2>
    <div className="space-y-4 sm:space-y-6">
      {services.map((service: any) => (
        <ServiceDetailCard key={service.id} service={service} />
      ))}
    </div>
  </div>
);

const ServiceDetailCard = ({ service }: any) => (
  <div className="border border-gray-200 dark:border-gray-600 rounded-sm p-4 sm:p-6 hover:border-[#0077B6] dark:hover:border-[#48CAE4] transition-all duration-200 group">
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#0077B6] dark:group-hover:text-[#48CAE4] text-sm sm:text-base">
        {service.name}
      </h3>
      <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-[#0077b6] dark:text-[#0077b6] text-xs font-medium rounded w-fit">
        {service.pricingType}
      </span>
    </div>

    {service.questions.length > 0 ? (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm">Questions & Answers:</h4>
        <div className="space-y-3">
          {service.questions.map((question: any, qIndex: number) => (
            <div key={qIndex} className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                {question.question_name}
              </p>
              {question.answer && (
                <p className="text-gray-800 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700 rounded-sm px-3 py-2">
                  {question.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : (
      <p className="text-gray-500 dark:text-gray-400 text-sm">No questions answered yet.</p>
    )}
  </div>
);

const LocationsTab = ({ businessAddress, serviceLocations }: any) => (
  <div className="space-y-4 sm:space-y-6">
    {/* Business Address Card */}
    <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-sm">
          <Building className="w-5 h-5 text-[#0077b6] dark:text-[#0077b6]" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Business Address</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Primary location</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm break-words">{businessAddress?.address_line}, {businessAddress?.city}, {businessAddress?.state}, {businessAddress?.country}, {businessAddress?.zipcode}</p>
            </div>
          </div>
        </div>

        <div className="h-40 sm:h-48 bg-gray-100 dark:bg-gray-700 rounded-sm flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Map View</p>
          </div>
        </div>
      </div>
    </div>

    {/* Service Locations */}
    {serviceLocations.length > 0 && (
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Service Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {serviceLocations.map((location: any, index: any) => (
            <ServiceLocationCard key={location._id} location={location} index={index} />
          ))}
        </div>
      </div>
    )}
  </div>
);

const ServiceLocationCard = ({ location, index }: any) => (
  <div className="border border-gray-200 dark:border-gray-600 rounded-sm p-3 sm:p-4 hover:border-[#0077B6] dark:hover:border-[#48CAE4] transition-all duration-200">
    <div className="flex items-start justify-between mb-3">
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
        Service Area {index + 1}
      </h3>
      <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-[#0077b6] dark:text-[#0077b6] text-xs font-medium rounded">
        Active
      </span>
    </div>

    <div className="space-y-2 text-sm">
      <p className="text-gray-800 dark:text-gray-300 text-sm break-words">
        {location.address_line || 'Various locations in'} {location.city}, {location.state}
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Service radius: {location.serviceRadiusMiles} miles
      </p>
    </div>
  </div>
);

const BusinessHoursTab = ({ businessHours, timezone }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700">
    {/* Header */}
    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-sm">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#0077b6] dark:text-[#0077b6]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Business Hours</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Current timezone: <span className="font-medium text-[#0077B6] dark:text-[#0077b6]">{timezone}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-sm border border-green-200 dark:border-green-800 w-fit">
          <div className="w-2 h-2 bg-[#0077b6] rounded-sm animate-pulse"></div>
          <span className="text-green-700 dark:text-green-300 text-sm font-medium">Open Now</span>
        </div>
      </div>
    </div>

    {/* Hours Grid */}
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-4xl">
        {businessHours.map((day: any) => (
          <BusinessHourCard key={day.day} day={day} />
        ))}
      </div>
    </div>
  </div>
);

const BusinessHourCard = ({ day }: any) => {
  const isToday = new Date().getDay() === day.day;
  const isOpen = day.status === 'open';

  return (
    <div
      className={`relative p-3 sm:p-4 rounded-sm border transition-all duration-300 ${isToday
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
        } ${isOpen ? 'hover:shadow-sm' : 'opacity-80'}`}
    >
      {/* Today Badge */}
      {isToday && (
        <div className="absolute -top-2 left-3 sm:left-4 px-2 py-1 bg-[#0077B6] text-white text-xs font-medium rounded-sm">
          Today
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm ${isOpen ? 'bg-[#0077b6]' : 'bg-red-500'
            }`}></div>
          <span className={`font-medium text-sm ${isToday
            ? 'text-[#0077b6] dark:text-blue-300'
            : 'text-gray-900 dark:text-white'
            }`}>
            {day.dayName}
          </span>
        </div>

        <div className="text-right">
          {isOpen ? (
            <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
              <span className="text-[#0077b6] dark:text-[#0077b6] text-sm">
                {new Date(day.start_time).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
              <span className="text-gray-400 dark:text-gray-500 text-sm hidden xs:inline">-</span>
              <span className="text-[#0077b6] dark:text-[#0077b6] font-medium text-sm">
                {new Date(day.end_time).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
          ) : (
            <span className="text-red-600 dark:text-red-400 font-medium text-sm">Closed</span>
          )}
        </div>
      </div>

      {/* Current Status */}
      {isToday && (
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Current status:</span>
            <span className={`font-medium ${isOpen
              ? 'text-[#0077b6] dark:text-[#0077b6]'
              : 'text-red-600 dark:text-red-400'
              }`}>
              {isOpen ? 'Open • Business as usual' : 'Closed '}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewsTab = ({ reviews, rating, totalReviews }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
    {reviews.length > 0 ? (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <div className="flex items-center gap-2">
              <RatingStars rating={rating} />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {rating}/5
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              ({totalReviews} reviews)
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.map((review: any) => (
            <ReviewCard
              key={review._id}
              review={review}
              reviews={reviews}
              rating={rating}
              totalReviews={totalReviews}
            />
          ))}
        </div>
      </div>
    ) : (
      <div className="text-center py-8 sm:py-12">
        <Star className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-800 mx-auto mb-3 sm:mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Reviews Yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm px-4">
          Reviews will appear here once customers start rating your services.
          Provide excellent service to get your first review!
        </p>
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Current Rating:</span>
          <div className="flex items-center gap-1">
            <RatingStars rating={rating} />
          </div>
          <span>({totalReviews} reviews)</span>
        </div>
      </div>
    )}
  </div>
);
const ReviewCard = ({ review }: any) => (
  <div className=" dark:border-gray-600 rounded-sm p-4 sm:p-6 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200">
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          {/* User Avatar and Info */}
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0077B6] to-[#48CAE4] rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm">
                <span className="text-sm font-bold text-white">
                  {review.user_id?.username?.slice(0, 2).toUpperCase() || 'CU'}
                </span>
              </div>
              {/* Online Status Indicator */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>

            {/* User Details */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {review.user_id?.username || 'Customer'}
                </h4>
                {/* Verified Badge */}
                <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                  <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {review.user_id?.email || 'customer@example.com'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Rating and Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1">
                <RatingStars rating={review.rating} />
                <span className="text-sm font-bold text-gray-900 dark:text-white ml-1">
                  {review.rating}/5
                </span>
              </div>
            </div>

            {/* Review Status Badge */}
            <div className={`px-3 py-2 rounded-lg border text-xs font-medium ${review.review_type === 'pending'
              ? 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'
              : 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
              }`}>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${review.review_type === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                <span className="capitalize">{review.review_type || 'completed'}</span>
              </div>
            </div>
          </div>

          {/* Review Date */}


          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(review.createdAt || review.date || new Date()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>

    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
      {review.message || review.comment || review.content || 'No review content available.'}
    </p>

    {review.tags && review.tags.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {review.tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#0077b6] dark:text-[#0077b6] text-xs font-medium rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

export default ProfessionalProfile;