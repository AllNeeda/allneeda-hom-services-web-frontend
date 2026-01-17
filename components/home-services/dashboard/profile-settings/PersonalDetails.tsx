"use client";
import { getAccessToken } from "@/app/api/axios";
import { useAuth } from "@/components/providers/context/auth-context";
import GlobalLoader from "@/components/ui/global-loader";
import { useProfessionalReview } from "@/hooks/RegisterPro/useRegister";
import {
  Phone,
  Timer,
  Users,
  Pencil,
  TrendingUp,
  Star,
  MapPin,
  Globe as WebsiteIcon,
  Calendar,
  Briefcase,
  Edit,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Local, narrow types for the response used by this component.
// Kept minimal and optional so the component is resilient to partial responses.
type Location = {
  address_line?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
};

type BusinessHour = {
  day?: string;
  status?: string;
  is_open?: boolean;
  open_time?: string;
  close_time?: string;
};

type ProfessionalShape = {
  business_name?: string;
  introduction?: string;
  phone?: string;
  founded_year?: string | number;
  employees?: number | string;
  website?: string;
  profile_image?: string | null;
  rating_avg?: number | string;
  total_review?: number | string;
  business_hours?: BusinessHour[];
};

type ProfessionalReviewResponse = {
  professional?: { professional?: ProfessionalShape; locations?: Location[] } | ProfessionalShape;
};

const PersonalDetails = () => {
  const token = getAccessToken() || "";
  const { data, isLoading, isError } = useProfessionalReview(token!);
  const { user, isLoading: isAuthLoading } = useAuth();

  if (isLoading || isAuthLoading) {
    return (
      <GlobalLoader></GlobalLoader>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-600 dark:text-red-400">Failed to load profile data.</div>
        </div>
      </div>
    );
  }
  const Backend_URL = process.env.NEXT_PUBLIC_API_BASE_MEDIA || 'http://localhost:4000';
  const typedData = (data ?? {}) as ProfessionalReviewResponse;
  let pro: ProfessionalShape = {};
  let locations: Location[] = [];

  if (typedData.professional) {
    const wrapper = typedData.professional as { professional?: ProfessionalShape; locations?: Location[] } | ProfessionalShape;
    if (typeof (wrapper as any).professional !== "undefined") {
      pro = (wrapper as { professional?: ProfessionalShape }).professional || {};
      locations = (wrapper as { locations?: Location[] }).locations || [];
    } else {
      pro = wrapper as ProfessionalShape;
    }
  } else if (data) {
    pro = data as unknown as ProfessionalShape;
  }
  const primaryLocation: Location = locations[0] ?? {};

  const fullAddress = [
    primaryLocation.address_line,
    primaryLocation.city,
    primaryLocation.state,
    primaryLocation.zipcode,
    primaryLocation.country,
  ]
    .filter(Boolean)
    .join(", ") || "No address provided";

  const businessHours: any[] = pro?.business_hours ?? [];
  const openDays = businessHours.filter(
    (h: any) => h?.status === "open" || h?.is_open === true
  ).length;

  const rawImage = pro?.profile_image;
  const profileImage = (() => {
    if (!rawImage) return "/default-profile.png";
    const s = String(rawImage);
    if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("blob:")) return s;
    return `${Backend_URL}/uploads/professionals/${s}`;
  })();

  const stats = [
    {
      label: "Rating",
      value: pro.rating_avg ? `${pro.rating_avg}/5` : "N/A",
      icon: Star,
      color: "text-[#BE13BF] dark:text-[#BE13BF]",
      bgColor: "bg-[#BE13BF]/10 dark:bg-[#BE13BF]/20"
    },
    {
      label: "Reviews",
      value: pro.total_review || "0",
      icon: TrendingUp,
      color: "text-[#6742EE] dark:text-[#6742EE]",
      bgColor: "bg-[#6742EE]/10 dark:bg-[#6742EE]/20"
    },
    {
      label: "Open Days",
      value: `${openDays}/7`,
      icon: Timer,
      color: "text-[#0077B6] dark:text-[#0077B6]",
      bgColor: "bg-[#0077B6]/10 dark:bg-[#0077B6]/20"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0077B6]/10 dark:bg-[#0077B6]/20 rounded px-3 py-1.5 border border-[#0077B6]/20 dark:border-[#0077B6]/30 mb-2">
              <div className="w-1.5 h-1.5 bg-[#0077B6] dark:bg-[#0077B6] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-[#0077B6] dark:text-[#0077B6]/90">
                Profile Overview 
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Business Profile
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage and update your business information
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/home-services/dashboard/profile-settings/edit-basic-info"
              className="inline-flex items-center h-9 px-4 text-sm bg-[#0077B6] hover:bg-[#0066A3] text-white rounded"
            >
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24">
                <Image
                  src={profileImage}
                  width={96}
                  height={96}
                  alt="Profile"
                  className="rounded-full object-cover w-full h-full border-4 border-white dark:border-gray-800 shadow"
                />
              </div>
            </div>

            {/* Business Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {pro.business_name || "Your Business Name"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Professional Service Provider
                </p>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-sm min-w-[100px]"
                  >
                    <div className={`p-1.5 rounded-sm ${stat.bgColor}`}>
                      <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Introduction Card */}
        <div className="bg-white dark:bg-gray-900 rounded-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-[#0077B6]/10 dark:bg-[#0077B6]/20 rounded-sm">
                <Users className="w-4 h-4 text-[#0077B6]" />
              </div>
              Introduction
            </h3>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {pro.introduction || "No introduction provided. Add a compelling description of your business to attract more customers."}
          </p>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white dark:bg-gray-900 rounded-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-[#6742EE]/10 dark:bg-[#6742EE]/20 rounded-sm">
                <Phone className="w-4 h-4 text-[#6742EE]" />
              </div>
              Contact Information
            </h3>
            <Link
              href="#"
              className="text-sm text-[#0077B6] hover:text-[#0066A3] font-medium inline-flex items-center gap-1"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-sm transition-colors">
              <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-sm">
                <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Phone Number
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.phoneNo || "Not provided"}
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Business Details Card */}
        <div className="bg-white dark:bg-gray-900 rounded-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-[#BE13BF]/10 dark:bg-[#BE13BF]/20 rounded-sm">
                <Briefcase className="w-4 h-4 text-[#BE13BF]" />
              </div>
              Business Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-sm transition-colors">
              <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-sm">
                <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Year Founded
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {pro.founded_year || "Not specified"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-sm transition-colors">
              <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-sm">
                <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Number of Employees
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {pro.employees || "0"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-sm transition-colors">
              <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-sm">
                <WebsiteIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Website
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {pro.website || "Not provided"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-white dark:bg-gray-900 rounded-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="p-1.5 bg-[#BE13BF]/10 dark:bg-[#BE13BF]/20 rounded-sm">
              <MapPin className="w-4 h-4 text-[#0077B6]" />

            </div>
            Business Location
          </h3>

          <div className="p-4 ">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#0077B6]  mt-0.5" />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {fullAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;