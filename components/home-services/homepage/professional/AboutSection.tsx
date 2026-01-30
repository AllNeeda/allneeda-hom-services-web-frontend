// components/home-services/professional-profile/components/sections/AboutSection.tsx
import { forwardRef } from "react";
import Link from "next/link";
import { 
  BadgeCheck, 
  Trophy, 
  MapPin, 
  UserCheck, 
  Users, 
  Clock9,
  MessageCircle,
  HandCoins
} from "lucide-react";
import { ProfessionalData } from "@/types/professionalDetails";

interface AboutSectionProps {
  professional: ProfessionalData;
}

const AboutSection = forwardRef<HTMLDivElement, AboutSectionProps>(
  ({ professional }, ref) => {
    // Format business hours
    const formatBusinessHours = () => {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      
      return professional.business_hours?.map((hour, index) => {
        const dayName = days[hour.day] || days[index];
        const startTime = new Date(hour.start_time).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        const endTime = new Date(hour.end_time).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        return {
          day: dayName,
          hours: hour.status === 'open' ? `${startTime} - ${endTime}` : 'Closed',
          isClosed: hour.status === 'closed'
        };
      }) || [];
    };

    const businessHours = formatBusinessHours();
    const yearsInBusiness = new Date().getFullYear() - professional.founded_year;

    return (
      <div ref={ref} className="space-y-4">
        <h3 className="text-md font-semibold">Introduction</h3>
        <p className="text-gray-700 dark:text-gray-300 text-xs whitespace-pre-line">
          {professional.introduction || "No introduction provided."}
        </p>
        
        <div className="flex flex-col md:flex-row w-full overflow-hidden">
          {/* Overview Section */}
          <div className="w-full md:w-2/3 p-6 flex-1">
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-300 mb-4">
              Overview
            </h2>

            <div className="space-y-6 text-xs">
              <ul className="space-y-2">
                {professional.rating_avg >= 4 && (
                  <li className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 fill-sky-500 dark:fill-sky-400 dark:text-yellow-400 text-yellow-500" />
                    Current top professional service
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Hired {professional.total_hire || 0} times
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Serves {professional.timezone || "Various locations"}
                </li>
                <li className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Background Checked
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {professional.employees || 0} Employees
                </li>
                <li className="flex items-center gap-2">
                  <Clock9 className="w-4 h-4" />
                  {yearsInBusiness} {yearsInBusiness === 1 ? 'year' : 'years'} in business
                </li>
              </ul>

              {/* Business Hours */}
              <div className="border border-gray-200 rounded dark:border-gray-700 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-200">
                  Business Hours
                </h3>
                <div className="flex flex-row">
                  <div className="w-full space-y-2 text-gray-600 font-medium">
                    {businessHours.map((day) => (
                      <div key={day.day}>{day.day}</div>
                    ))}
                  </div>
                  <div className="w-full space-y-2 text-gray-700 dark:text-gray-500">
                    {businessHours.map((day) => (
                      <div 
                        key={day.day}
                        className={day.isClosed ? "text-red-500" : ""}
                      >
                        {day.hours}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {professional.payment_methods && professional.payment_methods.length > 0 && (
            <div className="w-full md:w-1/3 p-6 flex-1">
              <h2 className="text-sm font-bold text-gray-800 mb-4 dark:text-gray-200">
                Payment Methods
              </h2>
              <div className="space-y-4 text-xs">
                <p>
                  This pro accepts payments via {professional.payment_methods.join(', ')}.
                </p>
              </div>
            </div>
          )}

        </div>

        {professional.specializations && professional.specializations.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm">Specializations:</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
              {professional.specializations.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="my-5">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-center items-center gap-3">
            <Link
              href={`/message?professional=${professional._id}`}
              className="w-full sm:w-auto text-sky-500 flex gap-2 items-center justify-center border border-gray-500 active:border-sky-500 px-5 py-2 hover:border-sky-500 rounded"
            >
              <MessageCircle className="w-4 h-4" />
              <p>Message</p>
            </Link>
            <Link
              href={`/request-quote?professional=${professional._id}`}
              className="w-full sm:w-auto text-sky-500 flex gap-2 items-center justify-center border border-gray-500 active:border-sky-500 px-5 py-2 hover:border-sky-500 rounded"
            >
              <HandCoins className="w-4 h-4" />
              <p>Request Quotation</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }
);

AboutSection.displayName = "AboutSection";

export default AboutSection;