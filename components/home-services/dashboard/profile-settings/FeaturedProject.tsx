"use client";
import { getAccessToken, getMediacUrl } from "@/app/api/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProFeaturedProject } from "@/hooks/profileSettings/useProfileSettings";
import { useProfesssionalProgress } from "@/hooks/RegisterPro/useRegister";
import { Plus, MapPin, DollarSign, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

// Define types for better TypeScript support
interface ProjectMedia {
  _id: string;
  fileUrl: string;
  source: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  professionalId: string;
  projectId: string;
}

interface FeaturedProject {
  _id: string;
  professional_id: string;
  service_id: string;
  cityname: string;
  projectTitle: string;
  approximate_total_price: number;
  duration: {
    type: string;
    value: number;
  };
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  year?: number;
  media: ProjectMedia[];
}

const FeaturedProject = () => {
  const [mediaURL, setMediaURL] = useState("");
  const token = getAccessToken() || "";
  const { data: professionalData } = useProfesssionalProgress(token);
  const [selectedProject, setSelectedProject] =
    useState<FeaturedProject | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const proId = useMemo(() => {
    if (!professionalData) return null;
    const id = Array.isArray(professionalData)
      ? professionalData?.[0]?._id
      : professionalData?._id;
    if (id) localStorage.setItem("proId", id);
    return id;
  }, [professionalData]);

  const {
    data: featuredProject,
    isError,
    isLoading,
  } = useProFeaturedProject(proId, token);
  useEffect(() => {
    const url = getMediacUrl();
    setMediaURL(url);
  }, []);

  const handleProjectClick = (project: FeaturedProject) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedProject(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const addProject = "add-project";

  // Show loading state
  if (isLoading) {
    return (
      <div className="rounded-lg bg-white dark:bg-gray-800 p-4 md:p-6 my-4">
        <div className="mb-4">
          <h1 className="font-bold text-lg">Featured Projects</h1>
        </div>
        <div className="flex justify-center">
          <div className="animate-pulse text-gray-500">
            Loading featured projects...
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="rounded-lg bg-white dark:bg-gray-800 p-4 md:p-6 my-4">
        <div className="mb-4">
          <h1 className="font-bold text-lg">Featured Projects</h1>
        </div>
        <div className="flex justify-center">
          <div className="text-red-500">Error loading featured projects</div>
        </div>
      </div>
    );
  }

  const featuredProjects = featuredProject?.data || [];

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-4 md:p-6 my-4">
      <div className="mb-6">
        <h1 className="font-bold text-lg md:text-xl">Featured Projects</h1>
        <p className="text-gray-500 text-sm mt-1">
          {featuredProjects.length} project
          {featuredProjects.length !== 1 ? "s" : ""} featured
        </p>
      </div>

      {featuredProjects.length === 0 ? (
        // Empty state
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="text-center">
            <div className="border-2 w-40 h-40 sm:w-44 sm:h-44 md:w-50 md:h-50 mx-auto flex justify-center items-center border-dashed border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
              <Plus className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-sm py-4">
              <p className="font-semibold">Project Name</p>
              <p className="text-gray-500">Approximate price</p>
            </div>
          </div>

          <div className="text-center">
            <div className="border-2 w-40 h-40 sm:w-44 sm:h-44 md:w-50 md:h-50 mx-auto flex justify-center items-center border-dashed border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
              <Plus className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-sm py-4">
              <p className="font-semibold">Project Name</p>
              <p className="text-gray-500">Approximate Price</p>
            </div>
          </div>
        </div>
      ) : (
        // Projects grid
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {featuredProjects.map((project: FeaturedProject) => (
            <div
              key={project._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleProjectClick(project)}
            >
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                {project.media?.[0]?.fileUrl ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={`${mediaURL}${project.media[0].fileUrl}`}
                      alt={project.projectTitle || "Project image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <p className="relative z-50 bg-red-300 p-2">
                    No image available
                  </p>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-sky-500 transition-colors">
                  {project.projectTitle}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="line-clamp-1">{project.cityname}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>{formatPrice(project.approximate_total_price)}</span>
                  </div>
                  {project.duration && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        {project.duration.value} {project.duration.type}
                        {project.duration.value !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Button */}
      <div className="flex justify-center items-center mt-8">
        <Button
          type="button"
          className="bg-sky-500 text-white hover:bg-sky-600 dark:hover:bg-sky-600 w-full sm:w-auto px-8 py-2"
        >
          <Link
            href={`/home-services/dashboard/profile-settings/${addProject}`}
          >
            Add New Project
          </Link>
        </Button>
      </div>

      {/* Project Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {selectedProject.projectTitle}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Images Gallery */}
                {selectedProject.media && selectedProject.media.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Project Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedProject.media.map((media) => (
                        <div
                          key={media._id}
                          className="aspect-rectangle rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          <Image
                            src={`${mediaURL}${media.fileUrl}`}
                            width={100}
                            height={100}
                            alt={selectedProject.projectTitle}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">
                          {selectedProject.cityname}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Approximate Price
                        </p>
                        <p className="font-medium text-lg text-green-600">
                          {formatPrice(selectedProject.approximate_total_price)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedProject.duration && (
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium">
                            {selectedProject.duration.value}{" "}
                            {selectedProject.duration.type}
                            {selectedProject.duration.value !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Created Date</p>
                        <p className="font-medium">
                          {formatDate(selectedProject.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedProject.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Project Description</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedProject.description}
                    </p>
                  </div>
                )}

                {/* Project Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Project Status</p>
                    <p className="font-medium">
                      {selectedProject.isActive ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Inactive</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {formatDate(selectedProject.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dialog Footer */}
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={closeDialog}
                  className="bg-sky-500 text-white hover:bg-sky-600"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeaturedProject;
