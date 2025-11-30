import { Button } from "@/components/ui/button";
import { ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";

const BackgroundCheck = () => {
  const proId = 5;
  const AddLicence = "add-licence";
  return (
    <div className="rounded bg-white dark:bg-gray-800 p-4 my-4">
      <h1 className="font-bold text-lg my-4">Credentials</h1>
      <div className="mt-4">
        <div className="flex flex-row gap-2 justify-start items-center">
          <UserCheck className="w-4 h-4" />
          <strong>Background Check</strong>
        </div>
        <div className="border-2 border-gray-200 border-dashed dark:border-gray-700 rounded-md text-gray-400 dark:text-gray-500 flex flex-row gap-2 p-6">
          <p className="flex-2">
            Add a background check badge to your profile by authorizing a free
            background check. This will help you build customer trust and get
            hired more.
          </p>
          <Button
            type="button"
            className="bg-transparent border border-gray-200 dark:border-gray-600 dark:hover:border-sky-500 text-sky-500 hover:bg-transparent hover:border-sky-500"
          >
            <Link
              href={`/home-services/dashboard/services/step-11/?id=${proId}`}
            >
              Start
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-4">
        {/* professional liecence */}
        <div className="flex flex-row gap-2 justify-start items-center">
          <ShieldCheck className="w-4 h-4" />
          <strong>Professional Licences</strong>
        </div>
        <div className="border-2 border-gray-200 border-dashed dark:border-gray-700 rounded-md text-gray-400 dark:text-gray-500 flex flex-row gap-2 p-6">
          <p className="flex-2">
            Customers prefer to hire professionals who are licensed in their
            profession.
          </p>
          <Button
            type="button"
            className="bg-transparent border border-gray-200 dark:border-gray-600 dark:hover:border-sky-500 text-sky-500 hover:bg-transparent hover:border-sky-500"
          >
            <Link
              href={`/home-services/dashboard/profile-settings/${AddLicence}`}
            >
              Add
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default BackgroundCheck;
