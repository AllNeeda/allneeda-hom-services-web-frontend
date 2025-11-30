import { Button } from "@/components/ui/button";
import Image from "next/image";

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
type CustomerProps = {
  profileDetails: CustomerType;
};
const ProfileInfo = ({ profileDetails }: CustomerProps) => {
  return (
    <div className="bg-white rounded p-4 flex flex-col justify-center items-center dark:bg-gray-800 dark:text-gray-300">
      <div className="flex flex-col justify-center items-center">
        <Image
          src={profileDetails.profile}
          width={100}
          height={100}
          alt="profile image"
          className="rounded-full w-24 h-24 "
        />
        <Button
          className="bg-sky-500 hover:bg-sky-600 text-white mt-1"
          size={"sm"}
          variant={"link"}
        >
          Update Photo
        </Button>
      </div>
      <div className="my-2 flex flex-col justify-center items-center">
        <h2 className="font-bold text-md">
          {profileDetails.first_name} {profileDetails.last_name}
        </h2>
        <h6 className="text-gray-500 text-sm">{profileDetails.email}</h6>
      </div>
      <div className="flex flex-row justify-center items-center text-center mt-2">
        <div className="border-r border-gray-300 dark:border-gray-700 px-4">
          <h1 className="font-bold">{profileDetails.project}</h1>
          <h4 className="text-gray-500 text-sm">Project</h4>
        </div>
        <div className="px-4">
          <h1 className="font-bold">{profileDetails.reviews}</h1>
          <h4 className="text-gray-500 text-sm">Reviews</h4>
        </div>
      </div>
    </div>
  );
};
export default ProfileInfo;
