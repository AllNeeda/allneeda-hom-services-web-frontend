// components/home-services/professional-profile/components/ProfileHeader.tsx
import Image from "next/image";
import { Star, BadgeCheck } from "lucide-react";
import ShareDialogWrapper from "@/components/home-services/homepage/ShareDialogWrapper";
import { ProfessionalData } from "@/types/professionalDetails";

interface ProfileHeaderProps {
  professional: ProfessionalData;
}

export default function ProfileHeader({ professional }: ProfileHeaderProps) {
  // Construct image URL - adjust based on your API
  const getImageUrl = () => {
    if (professional.profile_image) {
      return `${process.env.NEXT_PUBLIC_API_BASE_MEDIA}/uploads/professionals/${professional.profile_image}`;
    }
    return "/assets/home-service/service (1).jpg";
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start mb-6 sm:mb-8">
      
      <div className="mx-auto sm:mx-0">
        <Image
          src={getImageUrl()}
          width={160}
          height={160}
          alt={`${professional.business_name} profile`}
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border border-gray-200 dark:border-gray-800"
        />
      </div>
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold">
          {professional.business_name}
        </h1>
        <div className="flex flex-row justify-start items-center sm:items-start gap-2 mt-2">
          <p className="text-sm font-bold text-emerald-500 dark:text-emerald-400">
            Great {professional.rating_avg?.toFixed(1) || "N/A"}
          </p>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(professional.rating_avg || 0)
                  ? "fill-emerald-500 text-emerald-500"
                  : i < professional.rating_avg
                  ? "fill-emerald-500/50 text-emerald-500/50"
                  : "text-gray-300 dark:text-gray-600"
                  }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-400">
            ({professional.total_review || 0} reviews)
          </p>
        </div>
        
        {/* Top Pro badge - adjust condition based on your criteria */}
        {professional.rating_avg >= 4 && professional.total_review > 10 && (
          <div className="flex flex-row justify-start items-center gap-2 mt-2">
            <BadgeCheck className="w-6 h-6 fill-sky-500 text-yellow-500" />
            <p className="text-sm text-gray-500">Top Pro</p>
          </div>
        )}
        
        <div className="mt-4">
          <ShareDialogWrapper />
        </div>
      </div>
    </div>
  );
}