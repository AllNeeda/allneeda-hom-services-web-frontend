import ProfileInfo from "@/components/home-services/customer/ProfileInfo";
import ProfileSettings from "@/components/home-services/customer/ProfileSettings";

interface CustomerType {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile: string;
  phone: string;
  reviews: number;
  project: number;
}

const CustomerProfile = () => {
  const customer: CustomerType = {
    id: 2,
    first_name: "Esmatullh",
    last_name: "Hashhimi",
    email: "esmatullah.hashimi@gmail.com",
    profile: "/service_profile.jpg",
    phone: "0776442342",
    reviews: 345,
    project: 9,
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-gray-900 dark:text-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Responsive layout: stack on mobile, side by side on md+ */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3">
            <ProfileInfo profileDetails={customer} />
          </div>
          <div className="w-full lg:w-2/3">
            <ProfileSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
