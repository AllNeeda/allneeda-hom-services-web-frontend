"use client";

import { useEffect, useState, useRef } from "react";
import ImageUploadSection from "@/components/ui/admin/ImageUploadSection";
import {
  useCategoryServiceCount,
  useSubcategoryServiceCount,
} from "@/hooks/useHomeServices";
import {
  postSubcategory,
  updateSubcategory,
  deleteSubcategory,
  toggleSubcategoryStatus,
} from "@/app/api/homepage/postServices";
import { getAccessToken, getSubcategoryStaticURL } from "@/app/api/axios";
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
  Layers,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  FolderTree,
  Cpu,
  Zap,
  Sparkles,
  CircuitBoard,
  Binary,
  Network,
  Server,
  Link,
  Tag,
  ListTree,
  Briefcase,
} from "lucide-react";

interface SubcategoryItem {
  _id: string;
  name: string;
  slug: string;
  category_id: string;
  category_name?: string;
  serviceCount: number;
  servicesCount: number;
  is_active: boolean;
  subcategory_image_url?: string;
  description?: string;
}

interface CategoryItem {
  _id: string;
  name: string;
  is_active: boolean;
  subcategoryCount?: number;
}

interface SubcategoryFormDataType {
  _id?: string;
  name: string;
  slug: string;
  category_id: string;
  description: string;
  is_active: boolean;
  subcategory_image_file: File | null;
  subcategory_image_url: string;
}

const SubcategoryTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { delete: confirmDelete } = useConfirmation();

  // Store object URLs for cleanup
  const objectUrlsRef = useRef<string[]>([]);

  const [subcategoryFormData, setSubcategoryFormData] =
    useState<SubcategoryFormDataType>({
      _id: undefined,
      name: "",
      slug: "",
      category_id: "",
      description: "",
      is_active: true,
      subcategory_image_file: null,
      subcategory_image_url: "",
    });

  const token = getAccessToken() || "";
  const staticURL = getSubcategoryStaticURL();

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

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^-+|-+$/g, "");

  useEffect(() => {
    setSubcategoryFormData((prev) => ({ ...prev, slug: slugify(prev.name) }));
  }, [subcategoryFormData.name]);

  const handleImageSelect = (file: File | null) => {
    // Clean up previous object URL if it was a blob URL
    if (
      subcategoryFormData.subcategory_image_url &&
      subcategoryFormData.subcategory_image_url.startsWith("blob:")
    ) {
      const prevUrl = subcategoryFormData.subcategory_image_url;
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

        setSubcategoryFormData((prev) => ({
          ...prev,
          subcategory_image_file: file,
          subcategory_image_url: objectUrl,
        }));
      } catch (error) {
        console.error("Error creating object URL:", error);
        toast.error("Error", {
          description: "Failed to process image file",
        });
      }
    } else {
      // Handle case when image is cleared
      setSubcategoryFormData((prev) => ({
        ...prev,
        subcategory_image_file: null,
        subcategory_image_url: "",
      }));
    }
  };

  const handlepostSubcategory = async () => {
    if (!subcategoryFormData.subcategory_image_file && !isEditing) {
      toast.error("Error", {
        description: "Subcategory image is required for new subcategories",
      });
      return;
    }

    if (!subcategoryFormData.category_id) {
      toast.error("Error", {
        description: "Please select a category",
      });
      return;
    }

    if (!subcategoryFormData.name.trim()) {
      toast.error("Error", {
        description: "Subcategory name is required",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", subcategoryFormData.name);
      formData.append("slug", subcategoryFormData.slug);
      formData.append("category_id", subcategoryFormData.category_id);
      formData.append("description", subcategoryFormData.description);
      formData.append("is_active", String(subcategoryFormData.is_active));

      if (subcategoryFormData.subcategory_image_file) {
        formData.append(
          "subcategory_image_url",
          subcategoryFormData.subcategory_image_file
        );
      }

      if (isEditing && editingId) {
        await updateSubcategory(editingId, formData, token);
        toast.success("Success!", {
          description: "Subcategory updated successfully!",
        });
      } else {
        await postSubcategory(formData, token);
        toast.success("Success!", {
          description: "Subcategory created successfully!",
        });
      }

      // Refresh data
      refetchSubcategories();
      resetForm();
      setDialogOpen(false);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${isEditing ? "update" : "create"} subcategory`;

      toast.error("Error", {
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubcategory = (subcategory: SubcategoryItem) => {
    setIsEditing(true);
    setEditingId(subcategory._id);

    // Don't create object URL for existing images - use the direct URL
    setSubcategoryFormData({
      _id: subcategory._id,
      name: subcategory.name,
      slug: subcategory.slug,
      category_id: subcategory.category_id,
      description: subcategory.description || "",
      is_active: subcategory.is_active,
      subcategory_image_file: null,
      subcategory_image_url: subcategory.subcategory_image_url
        ? `${staticURL}/${subcategory.subcategory_image_url}`
        : "",
    });
    setDialogOpen(true);
  };

  const handleAddSubcategory = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleToggleStatus = async (
    subcategoryId: string,
    currentStatus: boolean
  ) => {
    try {
      await toggleSubcategoryStatus(subcategoryId, !currentStatus, token);
      toast.success("Success!", {
        description: `Subcategory ${
          !currentStatus ? "activated" : "deactivated"
        } successfully!`,
      });
      refetchSubcategories();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update subcategory status";
      toast.error("Error", {
        description: errorMsg,
      });
    }
  };

  const handledeleteSubcategory = (
    subcategoryId: string,
    subcategoryName: string
  ) => {
    confirmDelete(
      `Are you sure you want to delete "${subcategoryName}"? This action cannot be undone.`,
      async () => {
        try {
          await deleteSubcategory(subcategoryId, token);
          toast.success("Success!", {
            description: `Subcategory "${subcategoryName}" deleted successfully!`,
          });
          refetchSubcategories();
        } catch (err: any) {
          console.log("Error deleting subcategory:", err);
          toast.error("Error", {
            description:
              err.response?.data?.message || "Failed to delete subcategory",
          });
        }
      },
      subcategoryName
    );
  };

  const resetForm = () => {
    // Clean up object URL if exists
    if (
      subcategoryFormData.subcategory_image_url &&
      subcategoryFormData.subcategory_image_url.startsWith("blob:")
    ) {
      URL.revokeObjectURL(subcategoryFormData.subcategory_image_url);

      // Remove from ref array
      objectUrlsRef.current = objectUrlsRef.current.filter(
        (url) => url !== subcategoryFormData.subcategory_image_url
      );
    }

    setSubcategoryFormData({
      _id: undefined,
      name: "",
      slug: "",
      category_id: "",
      description: "",
      is_active: true,
      subcategory_image_file: null,
      subcategory_image_url: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  // Data fetching
  const { data: subcategoryServiceCount, refetch: refetchSubcategories } =
    useSubcategoryServiceCount();
  const { data: categoryServiceCount } = useCategoryServiceCount();

  // Process subcategory data
  const subcategoryDataRaw = subcategoryServiceCount?.data || [];
  let subcategoryItems: SubcategoryItem[] = [];

  if (Array.isArray(subcategoryDataRaw)) {
    subcategoryItems = subcategoryDataRaw;
  } else if (subcategoryDataRaw && Array.isArray(subcategoryDataRaw.data)) {
    subcategoryItems = subcategoryDataRaw.data;
  }

  // Process category data for dropdown
  const categoryList = categoryServiceCount?.data || [];
  let categoryArray: CategoryItem[] = [];

  if (Array.isArray(categoryList)) {
    categoryArray = categoryList;
  } else if (categoryList && Array.isArray(categoryList.data)) {
    categoryArray = categoryList.data;
  }

  // Filter only active categories for the dropdown
  const activeCategories = categoryArray.filter(
    (category) => category.is_active
  );

  // Use pagination hook
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedItems,
    goToPage,
    setItemsPerPage,
  } = usePagination(subcategoryItems, { itemsPerPage: 10 });

  // Calculate stats
  const totalSubcategories = subcategoryItems.length;
  const activeSubcategories = subcategoryItems.filter(
    (s) => s.is_active
  ).length;
  const inactiveSubcategories = subcategoryItems.filter(
    (s) => !s.is_active
  ).length;
  const totalServices = subcategoryItems.reduce(
    (sum, item) => sum + (item.servicesCount || item.serviceCount || 0),
    0
  );

  // Futuristic table columns for subcategories
  const subcategoryColumns: Column<SubcategoryItem>[] = [
    {
      key: "subcategory_image_url",
      header: "",
      isImage: true,
      className: "w-14",
      cellClassName: "py-3",
      imageClassName: "w-10 h-10 rounded-lg",
    },
    {
      key: "name",
      header: "SUBCATEGORY",
      className: "min-w-[180px]",
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
      key: "servicesCount",
      header: (
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" />
          <span>SERVICES</span>
        </div>
      ),
      className: "w-28 text-center",
      render: (item) => (
        <div className="flex items-center justify-center">
          <div className="relative">
            <span className="inline-flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-700/50">
              {item.servicesCount || item.serviceCount || 0}
            </span>
            {(item.servicesCount || item.serviceCount) > 0 && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "is_active",
      header: "STATUS",
      className: "w-32",
      render: (item) => (
        <div className="flex items-center justify-center">
          <div className="relative group">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
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
            <div
              className={`absolute -inset-1 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                item.is_active
                  ? "bg-green-500/10 dark:bg-green-500/20"
                  : "bg-red-500/10 dark:bg-red-500/20"
              }`}
            ></div>
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      className: "min-w-[260px]",
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
              handleEditSubcategory(item);
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
              handledeleteSubcategory(item._id, item.name);
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
  ];

  const handleRowClick = (subcategory: SubcategoryItem) => {
    // Optional: You can use this for viewing details
    console.log("View subcategory:", subcategory);
  };

  return (
    <div className="space-y-6">
      {/* Header Section - Futuristic */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-200 dark:border-purple-700/50 flex items-center justify-center">
              <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 bg-clip-text text-transparent">
              Subcategories
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Manage specialized service groups within categories
            </p>
          </div>
        </div>

        {/* Add Subcategory Button - Futuristic */}
        <Button
          onClick={handleAddSubcategory}
          className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-11 px-5 rounded shadow-purple-500/20 dark:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
          size="sm"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="font-semibold">New Subcategory</span>
          </div>
          <div className="absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-500/20 to-pink-500/20"></div>
        </Button>
      </div>

      {/* Stats Cards - Futuristic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Subcategories"
          value={totalSubcategories}
          icon={ListTree}
          color="purple"
          total={totalSubcategories}
          unit="subcats"
          compact={false}
        />

        <StatsCard
          title="Active"
          value={activeSubcategories}
          icon={Server}
          color="emerald"
          total={totalSubcategories}
          unit="online"
          compact={false}
        />

        <StatsCard
          title="Inactive"
          value={inactiveSubcategories}
          icon={Network}
          color="rose"
          total={totalSubcategories}
          unit="offline"
          compact={false}
        />

        <StatsCard
          title="Total Services"
          value={totalServices}
          icon={Briefcase}
          color="amber"
          total={totalServices}
          unit="services"
          compact={false}
        />
      </div>

      {/* Subcategories Table - Futuristic Design */}
      <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-900/30 dark:to-gray-800/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/30 overflow-hidden shadow-xl backdrop-blur-sm">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/30 bg-gradient-to-r from-gray-50/50 to-white/30 dark:from-gray-800/20 dark:to-gray-900/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Subcategory Grid
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/30">
                {subcategoryItems.length} total
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
          columns={subcategoryColumns}
          staticURL={staticURL}
          keyField="_id"
          emptyMessage="No subcategories found. Initialize the subcategory grid to begin."
          emptyIcon={
            <div className="text-gray-400 dark:text-gray-600">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <FolderTree className="w-8 h-8" />
              </div>
            </div>
          }
          emptyAction={
            <Button
              onClick={handleAddSubcategory}
              className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20"
            >
              <Zap className="w-4 h-4 mr-2" />
              Initialize Subcategory
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
            totalItems: subcategoryItems.length,
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
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 flex items-center justify-center">
                {isEditing ? (
                  <Edit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                ) : (
                  <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 bg-clip-text text-transparent">
                  {isEditing ? "Edit Subcategory" : "Create New Subcategory"}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {isEditing
                    ? "Update the subcategory configuration"
                    : "Initialize a new subcategory node in the system"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-cyan-600" />
                Parent Category *
              </label>
              <select
                value={subcategoryFormData.category_id}
                onChange={(e) =>
                  setSubcategoryFormData((prev) => ({
                    ...prev,
                    category_id: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all duration-200"
                required
              >
                <option value="" className="text-gray-400">
                  Select a category
                </option>
                {activeCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Name and Slug */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-600" />
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  value={subcategoryFormData.name}
                  onChange={(e) =>
                    setSubcategoryFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all duration-200"
                  placeholder="Enter subcategory name"
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
                  value={subcategoryFormData.slug}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded text-sm"
                  placeholder="Auto-generated slug"
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
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all duration-200 resize-none"
                rows={3}
                value={subcategoryFormData.description}
                onChange={(e) =>
                  setSubcategoryFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe what services this subcategory includes..."
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <ImageUploadSection
                onImageSelect={handleImageSelect}
                previewUrl={subcategoryFormData.subcategory_image_url}
                label={`Subcategory Image ${isEditing ? "(Optional)" : "*"}`}
                compact={false}
                futuristic={true}
              />
            </div>

            {/* Active Toggle */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CircuitBoard className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Active Status
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Toggle to make this subcategory visible or hidden
                  </p>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setSubcategoryFormData((prev) => ({
                        ...prev,
                        is_active: !prev.is_active,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                      subcategoryFormData.is_active
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        subcategoryFormData.is_active
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute -inset-2 rounded-full blur-sm opacity-0 transition-opacity duration-300 ${
                      subcategoryFormData.is_active
                        ? "bg-green-500/20 group-hover:opacity-100"
                        : "bg-gray-500/20 group-hover:opacity-100"
                    }`}
                  ></div>
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
              onClick={handlepostSubcategory}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow shadow-purple-500/20 dark:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{isEditing ? "Updating..." : "Initializing..."}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Edit className="w-4 h-4" />
                      Update Subcategory
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Create Subcategory
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

export default SubcategoryTab;
