// src/components/marketing-hub/ProfilePreview.tsx
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SmartphoneIcon,
  MonitorIcon,
  TabletIcon,
  StarIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ShareIcon,
  ClockIcon,
  CalendarIcon,
  TrendingUpIcon,
  Users,
  User,
  GlobeIcon,
  ChevronRightIcon,
  UsersIcon,
  Building,
  DollarSign,
  Clock,
  Eye,
  Briefcase,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { useGetServices } from "@/hooks/useServices";
import { getAccessToken } from "@/app/api/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GlobalLoader from "@/components/ui/global-loader";
interface VisibilitySettings {
  total_hire: boolean;
  last_hire: boolean;
  last_activity: boolean;
  last_seen: boolean;
}
interface ProfilePreviewProps {
  visibilitySettings: VisibilitySettings;
  isPending?: boolean;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  visibilitySettings,
}) => {
  const token = getAccessToken();
  const { data: profileData, isLoading } = useGetServices(token!);
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const DeviceButton = ({
    device,
    icon,
    label
  }: {
    device: 'mobile' | 'tablet' | 'desktop';
    icon: React.ReactNode;
    label: string;
  }) => (
    <Button
      size="sm"
      variant={activeDevice === device ? "default" : "outline"}
      onClick={() => setActiveDevice(device)}
      className={`h-9 w-9 sm:h-8 sm:w-auto sm:px-2 text-xs ${activeDevice === device
          ? 'text-white'
          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
        }`}
      style={activeDevice === device ? { backgroundColor: '#0077B6' } : {}}
    >
      {icon}
      <span className="hidden sm:inline ml-1 text-xs">{label}</span>
    </Button>
  );

  if (isLoading) {
    return (
      <GlobalLoader></GlobalLoader>
    );
  }
  if (!profileData?.services?.professional) {
    return (
      <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-sm border">
        <p className="text-gray-600 dark:text-gray-400 text-sm">No profile data available</p>
      </div>
    );
  }

  // Extract data
  const professional = profileData.services.professional;
  const services = profileData.services.services || [];
  const guarantees = profileData.services.guarantee || [];

  // Company info
  const companyName = professional.business_name || "";
  const introduction = professional.introduction || `${companyName} has been serving the community with exceptional services since ${professional.founded_year || ''}.`;

  // Location
  const location = services[0]?.location_ids?.[0]?.state || "";
  // Ratings
  const ratingAvg = Number(professional.rating_avg) || 0;
  const totalReviews = Number(professional.total_review) || 0;

  // Key stats from your data
  const totalHires = Number(professional.total_hire) || "";
  const employees = Number(professional.employees) || "";
  const foundedYear = Number(professional.founded_year) || 0;
  const yearsInBusiness = Math.max(1, new Date().getFullYear() - foundedYear);

  // Dates
  const lastHireDate = professional.last_hire_date
    ? new Date(professional.last_hire_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    : "";

  const lastActivity = professional.last_activity
    ? new Date(professional.last_activity).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    : "";

  // Last seen status
  const lastSeen = professional.last_seen ? new Date(professional.last_seen) : new Date();
  const isOnlineNow = (new Date().getTime() - lastSeen.getTime()) < 5 * 60 * 1000;

  const getLastSeenText = (): string => {
    const diffMs = new Date().getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
  const lastSeenText = getLastSeenText();
  const businessHours = professional.business_hours || [];
  const hasBusinessHours = businessHours.some((day: any) => day?.status === 'open');
  // Pricing
  const minPrice = Number(services[0]?.minimum_price) || 15;
  const maxPrice = Number(services[0]?.maximum_price) || 30;
  const pricingType = services[0]?.pricing_type || "hourly";
  const profileImage = professional.profile_image || "";
  const paymentMethods = (professional.payment_methods || [])
    .filter((method: string) => method && method !== 'null' && method !== 'undefined')
    .slice(0, 4);
  const workmanshipGuarantee = guarantees.find((g: any) => g.guarantee_type === '') || guarantees[0];
  const serviceGuaranteeText = workmanshipGuarantee?.guarantee_name || "";
  const serviceGuaranteeDesc = workmanshipGuarantee?.guarantee_details || "";

  // Business type
  const businessType = professional.business_type || "company";
  const professionalType = businessType === "individual" ? "Professional" : "Company";

  // All stats in column format - 13px text
  const statsColumns = [
    // Column 1
    [
      {
        label: "Total Hires",
        value: totalHires.toLocaleString(),
        isVisible: visibilitySettings.total_hire,
        icon: <TrendingUpIcon className="h-3.5 w-3.5" />,
        color: "#0077B6"
      },
      {
        label: "Last Hire",
        value: lastHireDate,
        isVisible: visibilitySettings.last_hire,
        icon: <CalendarIcon className="h-3.5 w-3.5" />,
        color: "#0077B6"
      },
      {
        label: "Last Activity",
        value: lastActivity,
        isVisible: visibilitySettings.last_activity,
        icon: <ClockIcon className="h-3.5 w-3.5" />,
        color: "#0077B6"
      },
      {
        label: "Last Seen",
        value: lastSeenText,
        isVisible: visibilitySettings.last_seen,
        icon: <Eye className="h-3.5 w-3.5" />,
        color: "#0077B6"
      }
    ],
    // Column 2
    [
      {
        label: "Employees",
        value: employees.toString(),
        isVisible: true,
        icon: <Users className="h-3.5 w-3.5" />,
        color: "#0077B6"
      },
      {
        label: "Years in Business",
        value: `${yearsInBusiness}+ years`,
        isVisible: true,
        icon: <Building className="h-3.5 w-3.5" />,
        color: "#0077B6"
      },
      {
        label: "Business Hours",
        value: hasBusinessHours ? "Open Now" : "Check Hours",
        isVisible: true,
        icon: <Clock className="h-3.5 w-3.5" />,
        color: "#0077B6"
      },
      {
        label: "Price Range",
        value: `$${minPrice}-$${maxPrice}`,
        subValue: `/${pricingType}`,
        isVisible: true,
        icon: <DollarSign className="h-3.5 w-3.5" />,
        color: "#0077B6"
      }
    ]
  ];

  const serviceAreas = services[0]?.location_ids?.length || 0;

  // Component for stat item
  const StatItem = ({ stat }: { stat: typeof statsColumns[0][0] }) => (
    <div className="flex items-center gap-3 py-1.5">
      {/* Icon */}
      <div className={`p-1.5 rounded ${!stat.isVisible && 'opacity-50'}`} style={{
        backgroundColor: stat.isVisible ? `${stat.color}15` : '#F3F4F6',
        color: stat.isVisible ? stat.color : '#9CA3AF'
      }}>
        {stat.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[13px] ${stat.isVisible ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
            {stat.label}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-[13px] font-medium text-right ${!stat.isVisible && 'opacity-60'}`} style={{
              color: stat.isVisible ? stat.color : '#9CA3AF'
            }}>
              {stat.value}
              {stat.subValue && (
                <span className="text-gray-600 dark:text-gray-400 ml-1">
                  {stat.subValue}
                </span>
              )}
            </span>
            {stat.isVisible ? (
              <Eye className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Preview Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-sm border dark:border-[#0077B6]">
        <div>
          <h3 className="text-base sm:text-md font-semibold text-gray-900 dark:text-white">
            Profile Preview
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            See how your profile appears to potential clients based on your visibility settings
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
          <Badge className="text-white text-xs py-1 px-3" style={{ backgroundColor: '#0077B6' }}>
            <GlobeIcon className="h-3 w-3 mr-1" />
            Live Preview
          </Badge>
          <div className="flex gap-2">
            <DeviceButton
              device="mobile"
              icon={<SmartphoneIcon className="h-3.5 w-3.5" />}
              label="Mobile"
            />
            <DeviceButton
              device="tablet"
              icon={<TabletIcon className="h-3.5 w-3.5" />}
              label="Tablet"
            />
            <DeviceButton
              device="desktop"
              icon={<MonitorIcon className="h-3.5 w-3.5" />}
              label="Desktop"
            />
          </div>
        </div>
      </div>

      {/* Desktop Preview */}
      {activeDevice === 'desktop' && (
        <div className="bg-white dark:bg-gray-900 rounded-sm p-4 sm:p-6 border dark:border-[#0077B6]">
          {/* Header */}
          <div className="flex items-start gap-4 sm:gap-6 mb-6">
            <div className="relative">
              <Avatar className="h-20 w-20 shadow-md border-2 border-white dark:border-gray-900">
                <AvatarImage src={profileImage} alt={companyName} />
                <AvatarFallback className="text-xl font-bold" style={{ backgroundColor: '#0077B6', color: 'white' }}>
                  {companyName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Online Status Badge */}
              {visibilitySettings.last_seen && isOnlineNow && (
                <div className="absolute -bottom-1 -right-1">
                  <Badge className="text-xs py-1 px-2 flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-3 w-3" />
                    Online
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {companyName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge className="text-white text-xs sm:text-sm py-1 px-3" style={{ backgroundColor: '#0077B6' }}>
                      <User className="h-3 w-3 mr-1" />
                      {professionalType}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {ratingAvg.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">({totalReviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <MapPinIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{location}</span>
                  </div>

                  {/* Last Seen Status */}
                  {visibilitySettings.last_seen && !isOnlineNow && (
                    <div className="flex items-center gap-1 mt-2">
                      <ClockIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Last seen: {lastSeenText}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900">
                    <ShareIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6 overflow-x-auto">
            {['About', 'Services', 'Photos', 'Reviews', 'Credentials', 'FAQs'].map((tab) => (
              <button
                key={tab}
                className="px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#0077B6] dark:hover:text-[#0077B6] whitespace-nowrap border-b-2 border-transparent hover:border-[#0077B6] transition-colors"
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Business Overview in Column Layout */}
              <div>
                <h2 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                  Business Overview
                </h2>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-sm p-4 border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Column 1 */}
                    <div className="space-y-2">
                      {statsColumns[0].map((stat, index) => (
                        <div key={index} className={`${index < statsColumns[0].length - 1 ? 'border-b border-gray-100 dark:border-gray-700 pb-2' : ''}`}>
                          <StatItem stat={stat} />
                        </div>
                      ))}
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-2">
                      {statsColumns[1].map((stat, index) => (
                        <div key={index} className={`${index < statsColumns[1].length - 1 ? 'border-b border-gray-100 dark:border-gray-700 pb-2' : ''}`}>
                          <StatItem stat={stat} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Introduction & Additional Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-md text-gray-900 dark:text-white mb-3">
                    About {companyName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed text-sm">
                    {introduction}
                  </p>

                  {/* Additional Business Info */}
                  <div className="mt-4 p-4 rounded-sm border dark:border-[#0077B6]" style={{ backgroundColor: '#0077B610' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5" style={{ color: '#0077B6' }} />
                        <div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">Service Areas</div>
                          <div className="text-md font-bold" style={{ color: '#0077B6' }}>{serviceAreas}+ locations</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <UsersIcon className="h-5 w-5" style={{ color: '#0077B6' }} />
                        <div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">Team Size</div>
                          <div className="text-md font-bold" style={{ color: '#0077B6' }}>{employees}+ professionals</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                {paymentMethods.length > 0 && (
                  <div>
                    <h2 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                      Accepted Payment Methods
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {paymentMethods.map((method: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-sm py-1.5 px-3 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Service Guarantee */}
              {workmanshipGuarantee && (
                <div className="p-5 rounded-sm border dark:border-[#0077B6]" style={{ backgroundColor: '#0077B610' }}>
                  <div className="flex items-start gap-3 mb-3">
                    <ShieldCheckIcon className="h-5 w-5" style={{ color: '#0077B6' }} />
                    <div>
                      <Badge className="text-white mb-2 text-xs py-1 px-3" style={{ backgroundColor: '#0077B6' }}>
                        {serviceGuaranteeText}
                      </Badge>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Service Guarantee
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {serviceGuaranteeDesc}
                  </p>
                  <a href="#" className="text-sm font-medium inline-flex items-center" style={{ color: '#0077B6' }}>
                    Learn more <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </a>
                </div>
              )}

              {/* Contact Card */}
              <div className="p-5 rounded-sm bg-gray-50 dark:bg-gray-900 border">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                  Get Started Today
                </h3>

                <div className="space-y-3">
                  <Button
                    className="w-full text-white h-12 text-sm hover:opacity-90"
                    style={{ backgroundColor: '#0077B6' }}
                  >
                    Request Free Quote
                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-12 text-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    View Full Details
                  </Button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tablet Preview */}
      {activeDevice === 'tablet' && (
        <div className="bg-white dark:bg-gray-900 rounded-sm p-4 sm:p-6 border dark:border-[#0077B6]">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profileImage} alt={companyName} />
                <AvatarFallback style={{ backgroundColor: '#0077B6', color: 'white' }}>
                  {companyName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Online Status Badge */}
              {visibilitySettings.last_seen && isOnlineNow && (
                <div className="absolute -bottom-1 -right-1">
                  <Badge className="text-xs py-1 px-2 flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Online
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-md sm:text-xl font-bold text-gray-900 dark:text-white">{companyName}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="text-xs text-white" style={{ backgroundColor: '#0077B6' }}>
                      {professionalType}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{ratingAvg.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Last Seen Status */}
                  {visibilitySettings.last_seen && !isOnlineNow && (
                    <div className="flex items-center gap-1 mt-2">
                      <ClockIcon className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Last seen: {lastSeenText}
                      </span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400">
                  <ShareIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Business Overview in Single Column for Tablet */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Business Overview</h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-sm p-4 border border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                {statsColumns.flat().slice(0, 8).map((stat, index) => (
                  <div key={index} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${!stat.isVisible && 'opacity-50'}`} style={{
                        backgroundColor: stat.isVisible ? `${stat.color}15` : '#F3F4F6',
                        color: stat.isVisible ? stat.color : '#9CA3AF'
                      }}>
                        {stat.icon}
                      </div>
                      <span className={`text-[13px] ${stat.isVisible ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                        {stat.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] font-medium ${!stat.isVisible && 'opacity-60'}`} style={{
                        color: stat.isVisible ? stat.color : '#9CA3AF'
                      }}>
                        {stat.value}
                      </span>
                      {stat.isVisible ? (
                        <Eye className="h-3 w-3 text-green-500" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">About Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {introduction}
            </p>
          </div>

          <Button
            className="w-full text-white text-sm py-3 hover:opacity-90"
            style={{ backgroundColor: '#0077B6' }}
          >
            Request Quote
            <ChevronRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
      {/* Mobile Preview */}
      {activeDevice === 'mobile' && (
        <div className="bg-white dark:bg-gray-900 rounded-sm p-4 border dark:border-[#0077B6]">
          {/* Mobile Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profileImage} alt={companyName} />
                <AvatarFallback className="text-sm" style={{ backgroundColor: '#0077B6', color: 'white' }}>
                  {companyName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Online Status Badge */}
              {visibilitySettings.last_seen && isOnlineNow && (
                <div className="absolute -bottom-1 -right-1">
                  <Badge className="text-[10px] py-0.5 px-1.5 flex items-center gap-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-2 w-2" />
                    Online
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-base font-bold text-gray-900 dark:text-white">{companyName}</h1>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge className="text-[10px] text-white" style={{ backgroundColor: '#0077B6' }}>
                      {professionalType}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-semibold">{ratingAvg.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Last Seen Status */}
                  {visibilitySettings.last_seen && !isOnlineNow && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <ClockIcon className="h-2.5 w-2.5 text-gray-500" />
                      <span className="text-[10px] text-gray-600 dark:text-gray-400">
                        Last seen: {lastSeenText}
                      </span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-600 dark:text-gray-400 text-xs">
                  <ShareIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Business Overview in Single Column for Mobile */}
          <div className="mb-3">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Business Overview</h3>
              <div className="space-y-2">
                {statsColumns.flat().slice(0, 4).map((stat, index) => (
                  <div key={index} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${!stat.isVisible && 'opacity-50'}`} style={{
                        backgroundColor: stat.isVisible ? `${stat.color}15` : '#F3F4F6',
                        color: stat.isVisible ? stat.color : '#9CA3AF'
                      }}>
                        {React.cloneElement(stat.icon as React.ReactElement)}
                      </div>
                      <span className={`text-[13px] ${stat.isVisible ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                        {stat.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[13px] font-medium ${!stat.isVisible && 'opacity-60'}`} style={{
                        color: stat.isVisible ? stat.color : '#9CA3AF'
                      }}>
                        {stat.value}
                      </span>
                      {stat.isVisible ? (
                        <Eye className="h-2.5 w-2.5 text-green-500" />
                      ) : (
                        <EyeOff className="h-2.5 w-2.5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Intro */}
          <div className="mb-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {introduction.split('.')[0]}.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <Button
              className="w-full text-xs text-white py-2 hover:opacity-90"
              style={{ backgroundColor: '#0077B6' }}
              size="sm"
            >
              Request Quote
            </Button>

            <Button
              variant="outline"
              className="w-full text-xs py-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              size="sm"
            >
              View Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePreview;