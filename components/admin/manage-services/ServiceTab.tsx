"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import ImageUploadSection from "@/components/ui/admin/ImageUploadSection";

import {
  useSubcategoryServiceCount,
  useServices,
} from "@/hooks/useHomeServices";
import {
  PostService,
  UpdateService,
  DeleteService,
  ToggleServiceStatus,
  ToggleServiceFeatured,
} from "@/app/api/homepage/postServices";
import { getAccessToken, getStaticURL } from "@/app/api/axios";
import DataTable, { Column } from "@/components/admin/ui/DataTable";
import StatsCard from "@/components/admin/ui/StatsCard";
import { usePagination } from "@/hooks/usePagination";
import { useConfirmation } from "@/hooks/useConfirmation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Cpu,
  Zap,
  Sparkles,
  CircuitBoard,
  Binary,
  Server,
  Star,
  Crown,
  DollarSign,
  Clock,
  Layers,
  Tag,
  Link,
  TrendingUp,
  Rocket,
} from "lucide-react";

interface ServiceItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  is_featured: boolean;
  image_url: string;
  subcategory_id: string;
  subcategory_name?: string;
  category_name?: string;
  price?: number;
  duration?: number;
  serviceCount?: number;
}

interface SubcategoryItem {
  _id: string;
  name: string;
  is_active: boolean;
  category_name?: string;
  serviceCount?: number;
}

interface ServiceFormDataType {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  is_featured: boolean;
  image_file: File | null;
  image_url: string;
  subcategory_id: string;
  price?: number;
  duration?: number;
}

const ServiceTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { delete: confirmDelete } = useConfirmation();

  // Store object URLs for cleanup
  const objectUrlsRef = useRef<string[]>([]);

  const [serviceFormData, setServiceFormData] = useState<ServiceFormDataType>({
    _id: undefined,
    name: "",
    slug: "",
    description: "",
    is_active: true,
    is_featured: false,
    image_file: null,
    image_url: "",
    subcategory_id: "",
    price: 0,
    duration: 0,
  });

  const token = getAccessToken() || "";
  const staticURL = getStaticURL();

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      // Clean up all object URLs on unmount
      objectUrlsRef.current.forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      objectUrlsRef.current = [];
    };
  }, []);

  const slugify = useCallback(
    (text: string) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^-+|-+$/g, ""),
    []
  );

  useEffect(() => {
    setServiceFormData((prev) => ({ ...prev, slug: slugify(prev.name) }));
  }, [serviceFormData.name, slugify]);

  const handleImageSelect = useCallback(
    (file: File | null) => {
      // Clean up previous object URL if it was a blob URL
      if (
        serviceFormData.image_url &&
        serviceFormData.image_url.startsWith("blob:")
      ) {
        const prevUrl = serviceFormData.image_url;
        URL.revokeObjectURL(prevUrl);

        // Remove from ref array
        objectUrlsRef.current = objectUrlsRef.current.filter(
          (url) => url !== prevUrl
        );
      }

      if (file) {
        try {
          const objectUrl = URL.createObjectURL(file);
          objectUrlsRef.current.push(objectUrl);

          setServiceFormData((prev) => ({
            ...prev,
            image_file: file,
            image_url: objectUrl,
          }));
        } catch (error) {
          console.error("Error creating object URL:", error);
          toast.error("Error", {
            description: "Failed to process image file",
          });
        }
      } else {
        // Handle case when image is cleared
        setServiceFormData((prev) => ({
          ...prev,
          image_file: null,
          image_url: "",
        }));
      }
    },
    [serviceFormData.image_url]
  );

  // Data fetching with memoization
  const { data: subcategoryServiceCount } = useSubcategoryServiceCount();
  const { data: servicesData, refetch: refetchServices } = useServices();

  // Memoize processed data to prevent recalculation on every render
  const processedSubcategories = useMemo(() => {
    const subcategoryDataRaw = subcategoryServiceCount?.data || [];
    let result: SubcategoryItem[] = [];

    if (Array.isArray(subcategoryDataRaw)) {
      result = subcategoryDataRaw;
    } else if (subcategoryDataRaw && Array.isArray(subcategoryDataRaw.data)) {
      result = subcategoryDataRaw.data;
    }

    return result.filter((sub) => sub.is_active);
  }, [subcategoryServiceCount]);

  const processedServices = useMemo(() => {
    const servicesList = servicesData?.data || [];
    let result: ServiceItem[] = [];

    if (Array.isArray(servicesList)) {
      result = servicesList;
    } else if (servicesList && Array.isArray(servicesList.data)) {
      result = servicesList.data;
    }

    return result;
  }, [servicesData]);

  // Memoize calculated stats
  const stats = useMemo(() => {
    const totalServices = processedServices.length;
    const activeServices = processedServices.filter((s) => s.is_active).length;
    const inactiveServices = processedServices.filter(
      (s) => !s.is_active
    ).length;
    const featuredServices = processedServices.filter(
      (s) => s.is_featured
    ).length;
    const totalRevenuePotential = processedServices.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );

    return {
      totalServices,
      activeServices,
      inactiveServices,
      featuredServices,
      totalRevenuePotential,
    };
  }, [processedServices]);

  // Stable refetch function
  const stableRefetchServices = useCallback(() => {
    refetchServices();
  }, [refetchServices]);

  const handlePostService = useCallback(async () => {
    if (!serviceFormData.image_file && !isEditing) {
      toast.error("Error", {
        description: "Service image is required for new services",
      });
      return;
    }

    if (!serviceFormData.subcategory_id) {
      toast.error("Error", {
        description: "Please select a subcategory",
      });
      return;
    }

    if (!serviceFormData.name.trim()) {
      toast.error("Error", {
        description: "Service name is required",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", serviceFormData.name);
      formData.append("slug", serviceFormData.slug);
      formData.append("subcategory_id", serviceFormData.subcategory_id);
      formData.append("description", serviceFormData.description);
      formData.append("is_active", String(serviceFormData.is_active));
      formData.append("is_featured", String(serviceFormData.is_featured));

      if (serviceFormData.price !== undefined) {
        formData.append("price", serviceFormData.price.toString());
      }

      if (serviceFormData.duration !== undefined) {
        formData.append("duration", serviceFormData.duration.toString());
      }

      if (serviceFormData.image_file) {
        formData.append("image_url", serviceFormData.image_file);
      }

      if (isEditing && editingId) {
        await UpdateService(editingId, formData, token);
        toast.success("Success!", {
          description: "Service updated successfully!",
        });
      } else {
        await PostService(formData, token);
        toast.success("Success!", {
          description: "Service created successfully!",
        });
      }

      // Refresh data with stable refetch
      stableRefetchServices();
      resetForm();
      setDialogOpen(false);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${isEditing ? "update" : "create"} service`;

      toast.error("Error", {
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [serviceFormData, isEditing, editingId, token, stableRefetchServices]);

  const handleEditService = useCallback(
    (service: ServiceItem) => {
      setIsEditing(true);
      setEditingId(service._id);

      // Don't create object URL for existing images - use the direct URL
      setServiceFormData({
        _id: service._id,
        name: service.name,
        slug: service.slug,
        description: service.description || "",
        is_active: service.is_active,
        is_featured: service.is_featured,
        image_file: null,
        image_url: service.image_url ? `${staticURL}/${service.image_url}` : "",
        subcategory_id: service.subcategory_id,
        price: service.price,
        duration: service.duration,
      });
      setDialogOpen(true);
    },
    [staticURL]
  );

  const handleAddService = useCallback(() => {
    resetForm();
    setDialogOpen(true);
  }, []);

  const handleToggleStatus = useCallback(
    async (serviceId: string, currentStatus: boolean) => {
      try {
        await ToggleServiceStatus(serviceId, !currentStatus, token);
        toast.success("Success!", {
          description: `Service ${
            !currentStatus ? "activated" : "deactivated"
          } successfully!`,
        });
        stableRefetchServices();
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to update service status";
        toast.error("Error", {
          description: errorMsg,
        });
      }
    },
    [token, stableRefetchServices]
  );

  const handleToggleFeatured = useCallback(
    async (serviceId: string, currentFeatured: boolean) => {
      try {
        await ToggleServiceFeatured(serviceId, !currentFeatured, token);
        toast.success("Success!", {
          description: `Service ${
            !currentFeatured ? "added to" : "removed from"
          } featured successfully!`,
        });
        stableRefetchServices();
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to update featured status";
        toast.error("Error", {
          description: errorMsg,
        });
      }
    },
    [token, stableRefetchServices]
  );

  const handleDeleteService = useCallback(
    (serviceId: string, serviceName: string) => {
      confirmDelete(
        `Are you sure you want to delete "${serviceName}"? This action cannot be undone.`,
        async () => {
          try {
            await DeleteService(serviceId, token);
            toast.success("Success!", {
              description: `Service "${serviceName}" deleted successfully!`,
            });
            stableRefetchServices();
          } catch (err: any) {
            console.log("Error deleting service:", err);
            toast.error("Error", {
              description:
                err.response?.data?.message || "Failed to delete service",
            });
          }
        },
        serviceName
      );
    },
    [confirmDelete, token, stableRefetchServices]
  );

  const resetForm = useCallback(() => {
    // Clean up object URL if exists
    if (
      serviceFormData.image_url &&
      serviceFormData.image_url.startsWith("blob:")
    ) {
      URL.revokeObjectURL(serviceFormData.image_url);

      // Remove from ref array
      objectUrlsRef.current = objectUrlsRef.current.filter(
        (url) => url !== serviceFormData.image_url
      );
    }

    setServiceFormData({
      _id: undefined,
      name: "",
      slug: "",
      description: "",
      is_active: true,
      is_featured: false,
      image_file: null,
      image_url: "",
      subcategory_id: "",
      price: 0,
      duration: 0,
    });
    setIsEditing(false);
    setEditingId(null);
  }, [serviceFormData.image_url]);

  // Use pagination hook with memoized data
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedItems,
    goToPage,
    setItemsPerPage,
  } = usePagination(processedServices, { itemsPerPage: 10 });

  // Memoize table columns to prevent recreation on every render
  const serviceColumns = useMemo<Column<ServiceItem>[]>(
    () => [
      {
        key: "image_url",
        header: "",
        isImage: true,
        className: "w-14",
        cellClassName: "py-3",
        imageClassName: "w-10 h-10 rounded-lg",
      },
      {
        key: "name",
        header: "SERVICE",
        className: "min-w-[200px]",
        render: (item) => (
          <div className="space-y-1">
            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
              {item.name}
            </div>
          </div>
        ),
      },
      {
        key: "description",
        header: "DESCRIPTION",
        className: "min-w-[250px]",
        render: (item) => (
          <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 w-48">
            {item.description || (
              <span className="text-gray-400 dark:text-gray-500 italic">
                No description
              </span>
            )}
          </div>
        ),
      },
      {
        key: "status",
        header: "STATUS",
        className: "w-32",
        render: (item) => (
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                  item.is_active
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700/50"
                    : "bg-gradient-to-r from-red-500/20 to-rose-500/20 dark:from-red-500/30 dark:to-rose-500/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700/50"
                }`}
              >
                {item.is_active ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    ACTIVE
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    INACTIVE
                  </>
                )}
              </span>
            </div>
            <div className="relative group">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                  item.is_featured
                    ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 dark:from-amber-500/30 dark:to-orange-500/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50"
                    : "bg-gradient-to-r from-gray-500/20 to-slate-500/20 dark:from-gray-500/30 dark:to-slate-500/30 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50"
                }`}
              >
                {item.is_featured ? (
                  <>
                    <Star className="w-3 h-3" />
                    FEATURED
                  </>
                ) : (
                  <>
                    <Tag className="w-3 h-3" />
                    STANDARD
                  </>
                )}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: "actions",
        header: "ACTIONS",
        className: "min-w-[280px]",
        render: (item) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleStatus(item._id, item.is_active);
              }}
              className={`group relative px-3 py-1.5 rounded text-xs font-medium transition-all duration-300 hover:scale-105 ${
                item.is_active
                  ? "bg-gradient-to-r from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 text-red-600 dark:text-red-400 hover:from-red-500/20 hover:to-rose-500/20 dark:hover:from-red-500/30 dark:hover:to-rose-500/30 border border-red-200 dark:border-red-700/50"
                  : "bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 text-green-600 dark:text-green-400 hover:from-green-500/20 hover:to-emerald-500/20 dark:hover:from-green-500/30 dark:hover:to-emerald-500/30 border border-green-200 dark:border-green-700/50"
              }`}
            >
              <div className="flex items-center gap-1.5">
                {item.is_active ? (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Activate
                  </>
                )}
              </div>
              <div className="absolute -inset-0.5 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-current/5 to-transparent"></div>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFeatured(item._id, item.is_featured);
              }}
              className={`group relative px-3 py-1.5 rounded text-xs font-medium transition-all duration-300 hover:scale-105 ${
                item.is_featured
                  ? "bg-gradient-to-r from-gray-500/10 to-slate-500/10 dark:from-gray-500/20 dark:to-slate-500/20 text-gray-600 dark:text-gray-400 hover:from-gray-500/20 hover:to-slate-500/20 dark:hover:from-gray-500/30 dark:hover:to-slate-500/30 border border-gray-200 dark:border-gray-700/50"
                  : "bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 text-amber-600 dark:text-amber-400 hover:from-amber-500/20 hover:to-orange-500/20 dark:hover:from-amber-500/30 dark:hover:to-orange-500/30 border border-amber-200 dark:border-amber-700/50"
              }`}
            >
              <div className="flex items-center gap-1.5">
                {item.is_featured ? (
                  <>
                    <Tag className="w-3.5 h-3.5" />
                    Unfeature
                  </>
                ) : (
                  <>
                    <Star className="w-3.5 h-3.5" />
                    Feature
                  </>
                )}
              </div>
              <div className="absolute -inset-0.5 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-current/5 to-transparent"></div>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditService(item);
              }}
              className="group relative px-3 py-1.5 rounded text-xs font-medium transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 text-blue-600 dark:text-blue-400 hover:from-blue-500/20 hover:to-cyan-500/20 dark:hover:from-blue-500/30 dark:hover:to-cyan-500/30 border border-blue-200 dark:border-blue-700/50"
            >
              <div className="flex items-center gap-1.5">
                <Edit className="w-3.5 h-3.5" />
                Edit
              </div>
              <div className="absolute -inset-0.5 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"></div>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteService(item._id, item.name);
              }}
              className="group relative px-3 py-1.5 rounded text-xs font-medium transition-all duration-300 hover:scale-105 bg-gradient-to-r from-red-500/10 to-pink-500/10 dark:from-red-500/20 dark:to-pink-500/20 text-red-600 dark:text-red-400 hover:from-red-500/20 hover:to-pink-500/20 dark:hover:from-red-500/30 dark:hover:to-pink-500/30 border border-red-200 dark:border-red-700/50"
            >
              <div className="flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </div>
              <div className="absolute -inset-0.5 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"></div>
            </button>
          </div>
        ),
      },
    ],
    [
      handleToggleStatus,
      handleToggleFeatured,
      handleEditService,
      handleDeleteService,
    ]
  );

  const handleRowClick = useCallback((service: ServiceItem) => {
    console.log("View service:", service);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section - Futuristic */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-200 dark:border-amber-700/50 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500 bg-clip-text text-transparent">
              Services
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Manage and optimize your service offerings
            </p>
          </div>
        </div>

        {/* Add Service Button - Futuristic */}
        <Button
          onClick={handleAddService}
          className="group relative bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white h-11 px-5 rounded shadow-amber-500/20 dark:shadow-amber-500/30 transition-all duration-300 hover:scale-105"
          size="sm"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="font-semibold">New Service</span>
          </div>
          <div className="absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-amber-500/20 to-orange-500/20"></div>
        </Button>
      </div>

      {/* Stats Cards - Futuristic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Services"
          value={stats.totalServices}
          icon={Briefcase}
          color="amber"
          total={stats.totalServices}
          unit="services"
          compact={false}
        />

        <StatsCard
          title="Active"
          value={stats.activeServices}
          icon={Server}
          color="emerald"
          total={stats.totalServices}
          unit="online"
          compact={false}
        />

        <StatsCard
          title="Featured"
          value={stats.featuredServices}
          icon={Crown}
          color="purple"
          total={stats.totalServices}
          unit="premium"
          compact={false}
        />

        <StatsCard
          title="Revenue Potential"
          value={stats.inactiveServices}
          icon={TrendingUp}
          color="rose"
          total={stats.totalRevenuePotential}
          unit="revenue"
          compact={false}
        />
      </div>

      {/* Services Table - Futuristic Design */}
      <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-900/30 dark:to-gray-800/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/30 overflow-hidden shadow-xl backdrop-blur-sm">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/30 bg-gradient-to-r from-gray-50/50 to-white/30 dark:from-gray-800/20 dark:to-gray-900/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Service Hub
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/30">
                {stats.totalServices} total
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <Binary className="w-4 h-4 inline mr-1" />
                Page{" "}
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {currentPage}
                </span>{" "}
                of {totalPages}
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={paginatedItems}
          columns={serviceColumns}
          staticURL={staticURL}
          keyField="_id"
          emptyMessage="No services found. Launch your first service to begin."
          emptyIcon={
            <div className="text-gray-400 dark:text-gray-600">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <Rocket className="w-8 h-8" />
              </div>
            </div>
          }
          emptyAction={
            <Button
              onClick={handleAddService}
              className="mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20"
            >
              <Zap className="w-4 h-4 mr-2" />
              Launch Service
            </Button>
          }
          onRowClick={handleRowClick}
          header={null}
          hover={true}
          striped={false}
          compact={false}
          pagination={{
            currentPage,
            totalPages,
            totalItems: processedServices.length,
            itemsPerPage,
            onPageChange: goToPage,
            onItemsPerPageChange: setItemsPerPage,
          }}
        />
      </div>

      {/* Create/Edit Dialog - Futuristic */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 dark:from-amber-500/30 dark:to-orange-500/30 flex items-center justify-center">
                {isEditing ? (
                  <Edit className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Plus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500 bg-clip-text text-transparent">
                  {isEditing ? "Edit Service" : "Create New Service"}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {isEditing
                    ? "Update the service configuration"
                    : "Launch a new service in the marketplace"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Subcategory Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-600" />
                Subcategory *
              </label>
              <select
                value={serviceFormData.subcategory_id}
                onChange={(e) =>
                  setServiceFormData((prev) => ({
                    ...prev,
                    subcategory_id: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all duration-200"
                required
              >
                <option value="" className="text-gray-400">
                  Select a subcategory
                </option>
                {processedSubcategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                    {subcategory.category_name &&
                      ` (${subcategory.category_name})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Name and Slug */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-amber-600" />
                  Service Name *
                </label>
                <input
                  type="text"
                  value={serviceFormData.name}
                  onChange={(e) =>
                    setServiceFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all duration-200"
                  placeholder="Enter service name"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Link className="w-4 h-4 text-gray-500" />
                  URL Slug
                </label>
                <input
                  type="text"
                  value={serviceFormData.slug}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded text-sm"
                  placeholder="Auto-generated slug"
                />
              </div>
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={serviceFormData.price || 0}
                  onChange={(e) =>
                    setServiceFormData((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all duration-200"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  value={serviceFormData.duration || 0}
                  onChange={(e) =>
                    setServiceFormData((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all duration-200"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all duration-200 resize-none"
                rows={3}
                value={serviceFormData.description}
                onChange={(e) =>
                  setServiceFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe what this service includes..."
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <ImageUploadSection
                onImageSelect={handleImageSelect}
                previewUrl={serviceFormData.image_url}
                label={`Service Image ${isEditing ? "(Optional)" : "*"}`}
                compact={false}
                futuristic={true}
              />
            </div>

            {/* Status Toggles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-white/30 dark:from-gray-800/20 dark:to-gray-900/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CircuitBoard className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Active Status
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Make service visible to customers
                  </p>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setServiceFormData((prev) => ({
                        ...prev,
                        is_active: !prev.is_active,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                      serviceFormData.is_active
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        serviceFormData.is_active
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-white/30 dark:from-gray-800/20 dark:to-gray-900/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Featured Status
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Highlight as premium service
                  </p>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setServiceFormData((prev) => ({
                        ...prev,
                        is_featured: !prev.is_featured,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                      serviceFormData.is_featured
                        ? "bg-gradient-to-r from-amber-500 to-orange-500"
                        : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        serviceFormData.is_featured
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePostService}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow shadow-amber-500/20 dark:shadow-amber-500/30 transition-all duration-300 hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{isEditing ? "Updating..." : "Launching..."}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Edit className="w-4 h-4" />
                      Update Service
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Launch Service
                    </>
                  )}
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceTab;
