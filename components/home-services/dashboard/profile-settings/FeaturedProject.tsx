import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const FeaturedProject = () => {
  const addProject = "add-project";
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-4 md:p-6 my-4">
      <div className="mb-4">
        <h1 className="font-bold text-lg">Featured Project</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="text-center">
          <div className="border-2 w-40 h-40 sm:w-44 sm:h-44 md:w-50 md:h-50 mx-auto flex justify-center items-center border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <Plus className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-sm py-4">
            <p className="font-semibold">Project Name</p>
            <p className="text-gray-500">Approximate price</p>
          </div>
        </div>

        <div className="text-center">
          <div className="border-2 w-40 h-40 sm:w-44 sm:h-44 md:w-50 md:h-50 mx-auto flex justify-center items-center border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <Plus className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-sm py-4">
            <p className="font-semibold">Project Name</p>
            <p className="text-gray-500">Approximate Price</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center my-5">
        <Button
          type="button"
          className="bg-sky-500 text-white hover:bg-sky-500 dark:hover:bg-sky-500 w-full sm:w-auto"
        >
          <Link
            href={`/home-services/dashboard/profile-settings/${addProject}`}
          >
            Add new project
          </Link>
        </Button>
      </div>
    </div>
  );
};
export default FeaturedProject;
