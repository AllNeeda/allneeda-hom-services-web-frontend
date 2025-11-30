"use client";

import AddLicence from "@/components/home-services/dashboard/profile-settings/edit/AddLicence";
import AddMedia from "@/components/home-services/dashboard/profile-settings/edit/AddMedia";
import AddProject from "@/components/home-services/dashboard/profile-settings/edit/AddProject";
import EditBasicInfo from "@/components/home-services/dashboard/profile-settings/edit/EditBasicInfo";
import EditIntroduction from "@/components/home-services/dashboard/profile-settings/edit/EditIntroduction";
import EditPayment from "@/components/home-services/dashboard/profile-settings/edit/EditPayment";
import EditQAndA from "@/components/home-services/dashboard/profile-settings/edit/EditQAndA";
import GetBackgroundCheck from "@/components/home-services/dashboard/profile-settings/edit/GetBackgroundCheck";
import { useParams } from "next/navigation";
import { JSX } from "react";

// Import all components

const EditProfilePage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const componentMap: Record<string, JSX.Element> = {
    "edit-basic-info": <EditBasicInfo />,

    "edit-intro": <EditIntroduction />,
    "bg-check": <GetBackgroundCheck />,
    "add-licence": <AddLicence />,
    "edit-payment": <EditPayment />,
    "add-media": <AddMedia />,
    "add-project": <AddProject />,
    "edit-q-and-a": <EditQAndA />,
  };

  const ComponentToRender = componentMap[slug] || (
    <p className="text-red-500">Component not found</p>
  );

  return (
    <div className="rounded bg-white dark:bg-gray-800 p-4 my-4">
      {ComponentToRender}
    </div>
  );
};

export default EditProfilePage;
