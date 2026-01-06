import { useState, FC } from "react";
import Preferences from "./preferences";
import NotInterested from "./NotInterested";
import PurchaseCredits from "./PurchaseCredits";
import {
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  Settings,
} from "lucide-react";
import ContactCustomer from "./ContactCustomer";
import Link from "next/link";

interface LeadDetailsProps {
  leadDetails: {
    title?: string;
    user?: {
      username?: string;
      email?: string;
      phone?: string;
      is_phone_verified?: boolean;
    };
    user_location?: {
      city?: string;
      state?: string;
      postcode?: string;
    };
    createdAt?: string;
    answers?: Array<{
      question_id: string;
      answer: string;
      question_name: string;
    }>;
    professionals?: any[];
    professionalLeads?: any[];
  };
}

const ProfessionalCard: FC<LeadDetailsProps> = ({ leadDetails }) => {
  const [expanded, setExpanded] = useState(false);
  const [creditsVisible, setCreditsVisible] = useState(false);
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [IsContactModalOpen, setContactIsModalOpen] = useState(false);
  const [isPurchaseCreditsOpen, setIsPurchaseCreditsOpen] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);
  const toggleCredits = () => setCreditsVisible(!creditsVisible);
  console.log("The Lead Details: ", leadDetails);
  // Safe data access with fallbacks
  const title = leadDetails?.title || "No Title";
  const user = leadDetails?.user || {};
  const location = leadDetails?.user_location || {};
  const createdAt = leadDetails?.createdAt || "";
  const answers = leadDetails?.answers || [];
  const professionalLeads = leadDetails?.professionalLeads || [];
  console.log("the user: ", leadDetails.user);
  // Format the date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      );

      if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
      } else {
        return `${Math.floor(diffInHours / 24)} days ago`;
      }
    } catch (error) {
      return `Recently ${error}`;
    }
  };

  // Get user initials
  const getUserInitials = (username?: string) => {
    if (!username) return "U";
    return username.charAt(0).toUpperCase();
  };

  // Mask email and phone
  const maskEmail = (email?: string) => {
    if (!email) return "e***@e***.com";
    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return "e***@e***.com";
    return `${localPart.charAt(0)}***${localPart.slice(-1)}@${domain}`;
  };

  const maskPhone = (phone?: string) => {
    if (!phone) return "000******000";
    return phone.slice(0, 3) + "******" + phone.slice(-4);
  };

  // Get username display name
  const getDisplayName = (username?: string) => {
    if (!username) return "User";
    return username.split("@")[0] || "User";
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 dark:text-gray-100">
      {/* Header Section */}
      <div className="md:p-2 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white font-bold text-lg">
                {getUserInitials(user.email)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white dark:border-gray-900">
                <ShieldCheck className="h-3.5 w-3.5 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {getDisplayName(user.email)}
                </h1>
              </div>

              <div className="mt-2">
                <div className="inline-flex items-center bg-[#0077B6]/5 border border-[#0077B6]/10 text-[#0077B6] text-sm font-normal text-[12px] px-6 py-1 rounded-sm">
                  {title}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row font-normal items-start sm:items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
            <MapPin className="h-4 w-4 text-[#0077B6] mr-1.5" />
            <span>
              {location.city || "City"}, {location.postcode || "Postcode"}
            </span>
          </div>

          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-1.5" />
            <span className="text-gray-600 dark:text-gray-400">
              Posted {formatDate(createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-2.5 rounded-lg mr-3">
            <Phone className="h-5 w-5 text-[#0077B6]" />
          </div>
          <div>
            <span className="text-gray-800 dark:text-gray-200 font-medium text-sm block">
              {maskPhone(user.phone)}
            </span>
            <div className="flex items-center mt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400 text-xs">
                {user.is_phone_verified
                  ? "Verified phone number"
                  : "Phone not verified"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-2.5 rounded-lg mr-3">
            <Mail className="h-5 w-5 text-[#0077B6]" />
          </div>
          <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">
            {maskEmail(user.email)}
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="p-5 bg-blue-50 dark:bg-blue-950 border-b border-blue-100 dark:border-blue-800">
        <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
          <span className="text-[#0077B6] font-semibold text-sm">
            Response Progress
          </span>
          <span className="text-[#0077B6] font-medium text-sm">
            {professionalLeads.length}/5 professionals
          </span>
        </div>
        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] h-2 rounded-full transition-all duration-500"
            style={{ width: `${(professionalLeads.length / 5) * 100}%` }}
          ></div>
        </div>
        <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">
          {professionalLeads.length} professionals have responded to similar
          requests
        </p>
      </div>

      {/* Action Buttons */}
      <div className="p-5 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <span
          onClick={() => setContactIsModalOpen(true)}
          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 cursor-pointer hover:to-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-red-200/50 flex items-center justify-center text-sm"
        >
          <AlertCircle className="h-4 w-4 mr-1.5" />
          Contact
          {IsContactModalOpen && (
            <ContactCustomer
              onClose={() => setContactIsModalOpen(false)}
              onBuyCredits={() => {
                setContactIsModalOpen(false);
                setIsPurchaseCreditsOpen(true);
              }}
            />
          )}
        </span>
        <span
          onClick={() => setIsModalOpen(true)}
          className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center text-sm"
        >
          Not interested
          {IsModalOpen && (
            <NotInterested onClose={() => setIsModalOpen(false)} />
          )}
        </span>
      </div>

      {/* PurchaseCredits Modal */}
      {isPurchaseCreditsOpen && (
        <PurchaseCredits
          pricePerCredit={1.4}
          credits={100}
          creditsUsed={0}
          onClose={() => setIsPurchaseCreditsOpen(false)}
        />
      )}

      {/* Expandable Credits Section */}
      <div
        className={`${
          creditsVisible
            ? "bg-blue-50 dark:bg-blue-950"
            : "bg-white dark:bg-gray-900"
        } border-t border-gray-100 dark:border-gray-700 cursor-pointer transition-colors duration-200`}
        onClick={toggleCredits}
      >
        <div className="p-5 flex justify-between items-center">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-[#0077B6] mr-3" />
            <div>
              <div className="flex items-center">
                <span className="text-lg font-bold text-[#0077B6]">11</span>
                <span className="ml-1 text-gray-700 dark:text-gray-300 font-medium text-sm">
                  credits
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Covered by our Get Hired Guarantee
              </p>
            </div>
          </div>
          {creditsVisible ? (
            <ChevronUp className="h-5 w-5 text-[#0077B6] transition-transform duration-200" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#0077B6] transition-transform duration-200" />
          )}
        </div>

        {creditsVisible && (
          <div className="px-5 pb-5 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700 shadow-xs">
              <h3 className="font-semibold text-[#0077B6] text-sm mb-2">
                Guarantee Details
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs">
                If you are not hired during the starter pack, we will return all
                your credits. This guarantee ensures you get value from our
                platform.
              </p>
              <div className="mt-3 flex items-center text-green-600 dark:text-green-400 text-xs">
                <CheckCircle className="h-4 w-4 mr-1.5" />
                <span>Active until: September 30, 2025</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Highlights Section */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Highlights
          </h3>
          <button
            onClick={toggleExpanded}
            className="text-[#0077B6] text-xs font-medium flex items-center"
          >
            {expanded ? "Show less" : "Show more"}
            {expanded ? (
              <ChevronUp className="h-4 w-4 ml-1 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-200" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 flex items-center border border-blue-100 dark:border-blue-800">
            <div className="bg-[#0077B6] p-2 rounded-lg mr-2">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
              Urgent
            </span>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 flex items-center border border-blue-100 dark:border-blue-800">
            <div className="bg-[#0077B6] p-2 rounded-lg mr-2">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
              {user.is_phone_verified ? "Verified" : "Not Verified"}
            </span>
          </div>

          {/* Add more highlights based on your lead data */}
        </div>

        {expanded && (
          <div className="mt-4 animate-fadeIn">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-2">
                Additional Details
              </h4>
              <ul className="text-gray-600 dark:text-gray-300 text-xs space-y-2">
                {answers.length > 0 ? (
                  answers.map((answer, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{answer.answer}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 dark:text-gray-400">
                    No additional details available
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Pass answers to Preferences component */}
      <Preferences answers={answers} />

      {/* Bottom Lead Settings */}
      <div className="w-full max-w-full sm:max-w-md p-4">
        <p className="font-semibold text-gray-800 dark:text-gray-200">
          Not seeing the right leads?
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Stop seeing leads with specific answers by customising your settings.
        </p>
        <Link
          href="/home-services/dashboard/leads/leadSetting"
          className="flex items-center text-[#0077B6] hover:underline mt-2 text-sm"
        >
          <Settings className="w-4 h-4 mr-1 text-[#0077B6]" />
          Update lead settings
        </Link>
      </div>
    </div>
  );
};

export default ProfessionalCard;
