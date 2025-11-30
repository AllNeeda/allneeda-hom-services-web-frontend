import AdditionalProfileBadge from "@/components/home-services/dashboard/profile-settings/AdditionalProfileBadge";
import BackgroundCheck from "@/components/home-services/dashboard/profile-settings/BackgroundCheck";
import FAQs from "@/components/home-services/dashboard/profile-settings/FAQs";
import FeaturedProject from "@/components/home-services/dashboard/profile-settings/FeaturedProject";
import MediaGallary from "@/components/home-services/dashboard/profile-settings/MediaGallery";
import PaymentMethod from "@/components/home-services/dashboard/profile-settings/PaymentMethod";
import PersonalDetails from "@/components/home-services/dashboard/profile-settings/PersonalDetails";
import Reviews from "@/components/home-services/dashboard/profile-settings/Reviews";

const ProfessionalProfile = () => {
  return (
    <div className="">
      <PersonalDetails />
      <Reviews />
      <BackgroundCheck />
      <PaymentMethod />
      <MediaGallary />
      <AdditionalProfileBadge />
      <FeaturedProject />
      <FAQs />
    </div>
  );
};
export default ProfessionalProfile;
