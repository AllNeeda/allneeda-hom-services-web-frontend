"use client";

import {
  PostCategory,
  UpdateCategory,
  DeleteCategory,
  ToggleCategoryStatus,
} from "@/app/api/homepage/postServices";
import { useEffect, useState, useRef } from "react";
import ActiveToggle from "@/components/ui/admin/ActiveToggle";
import ImageUploadSection from "@/components/ui/admin/ImageUploadSection";
import { useCategoryServiceCount } from "@/hooks/useHomeServices";
import DataTable, { Column } from "@/components/admin/ui/DataTable";
import StatsCard from "@/components/admin/ui/StatsCard";
import { getAccessToken, getCategoryStaticURL } from "@/app/api/axios";
import { usePagination } from "@/hooks/usePagination";
import {
  FolderTree,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Cpu,
  Zap,
  CircuitBoard,
  Binary,
  Layers,
  Network,
  Server,
  Database,
} from "lucide-react";
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
import { useConfirmation } from "@/hooks/useConfirmation";

interface CategoryType {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  category_image_file: File | null;
  category_image_url: string;
}

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  category_image_url: string;
  subcategoryCount?: number;
}

const CategoryTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { delete: confirmDelete } = useConfirmation();
  const objectUrlsRef = useRef<string[]>([]);

  const [categoryFormData, setCategoryFormData] = useState<CategoryType>({
    _id: undefined,
    name: "",
    slug: "",
    description: "",
    is_active: true,
    category_image_file: null,
    category_image_url: "",
  });

  const token = getAccessToken() || "";
  const staticURL = getCategoryStaticURL();

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
    setCategoryFormData((prev) => ({ ...prev, slug: slugify(prev.name) }));
  }, [categoryFormData.name]);

  const handleImageSelect = (file: File | null) => {
    // Clean up previous object URL if it was a blob URL
    if (
      categoryFormData.category_image_url &&
      categoryFormData.category_image_url.startsWith("blob:")
    ) {
      const prevUrl = categoryFormData.category_image_url;
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

        setCategoryFormData((prev) => ({
          ...prev,
          category_image_file: file,
          category_image_url: objectUrl,
        }));
      } catch (error) {
        console.error("Error creating object URL:", error);
        toast.error("Error", {
          description: "Failed to process image file",
        });
      }
    } else {
      // Handle case when image is cleared
      setCategoryFormData((prev) => ({
        ...prev,
        category_image_file: null,
        category_image_url: "",
      }));
    }
  };

  const handlePostCategory = async () => {
    if (!categoryFormData.category_image_file && !isEditing) {
      toast.error("Error", {
        description: "Category image is required for new categories",
      });
      return;
    }

    if (!categoryFormData.name.trim()) {
      toast.error("Error", {
        description: "Category name is required",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", categoryFormData.name);
      formData.append("slug", categoryFormData.slug);
      formData.append("description", categoryFormData.description);
      formData.append("is_active", String(categoryFormData.is_active));

      if (categoryFormData.category_image_file) {
        formData.append(
          "category_image_url",
          categoryFormData.category_image_file
        );
      }

      if (isEditing && editingId) {
        await UpdateCategory(editingId, formData, token);
        toast.success("Success!", {
          description: "Category updated successfully!",
        });
      } else {
        await PostCategory(formData, token);
        toast.success("Success!", {
          description: "Category created successfully!",
        });
      }

      // Refresh data
      refetch();
      resetForm();
      setDialogOpen(false);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${isEditing ? "update" : "create"} category`;

      toast.error("Error", {
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = (category: CategoryItem) => {
    setIsEditing(true);
    setEditingId(category._id);

    // Don't create object URL for existing images - use the direct URL
    setCategoryFormData({
      _id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      is_active: category.is_active,
      category_image_file: null,
      category_image_url: category.category_image_url
        ? `${staticURL}/${category.category_image_url}`
        : "",
    });
    setDialogOpen(true);
  };

  const handleAddCategory = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleToggleStatus = async (
    categoryId: string,
    currentStatus: boolean
  ) => {
    try {
      await ToggleCategoryStatus(categoryId, !currentStatus, token);
      toast.success("Success!", {
        description: `Category ${
          !currentStatus ? "activated" : "deactivated"
        } successfully!`,
      });
      refetch();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update category status";
      toast.error("Error", {
        description: errorMsg,
      });
    }
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    confirmDelete(
      `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`,
      async () => {
        try {
          await DeleteCategory(categoryId, token);
          toast.success("Success!", {
            description: `Category "${categoryName}" deleted successfully!`,
          });
          refetch();
        } catch (err: any) {
          console.log("Error deleting category:", err);
          toast.error("Error", {
            description:
              err.response?.data?.message || "Failed to delete category",
          });
        }
      },
      categoryName
    );
  };

  const resetForm = () => {
    // Clean up object URL if exists
    if (
      categoryFormData.category_image_url &&
      categoryFormData.category_image_url.startsWith("blob:")
    ) {
      URL.revokeObjectURL(categoryFormData.category_image_url);

      // Remove from ref array
      objectUrlsRef.current = objectUrlsRef.current.filter(
        (url) => url !== categoryFormData.category_image_url
      );
    }

    setCategoryFormData({
      _id: undefined,
      name: "",
      slug: "",
      description: "",
      is_active: true,
      category_image_file: null,
      category_image_url: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const { data: categoryServiceCount, refetch } = useCategoryServiceCount();
  const categoryData: CategoryItem[] = categoryServiceCount?.data.data || [];

  // Use pagination hook
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedItems,
    goToPage,
    setItemsPerPage,
  } = usePagination(categoryData, { itemsPerPage: 10 });

  // Futuristic table columns
  const categoryColumns: Column<CategoryItem>[] = [
    {
      key: "category_image_url",
      header: "",
      isImage: true,
      className: "w-14",
      cellClassName: "py-0",
      imageClassName: "w-12 h-10 object-cover rounded",
    },
    {
      key: "name",
      header: "CATEGORY",
      className: "min-w-[200px]",
      render: (category) => (
        <div className="w-48">
          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-1 w-full">
            {category.name}
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "DESCRIPTION",
      className: "min-w-[250px]",
      render: (category) => (
        <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 w-48">
          {category.description || (
            <span className="text-gray-400 dark:text-gray-500 italic">
              No description
            </span>
          )}
        </div>
      ),
    },
    {
      key: "subcategoryCount",
      header: (
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>SUBCATS</span>
        </div>
      ),
      className: "w-28 text-center",
      render: (category) => (
        <div className="flex items-center justify-center">
          <div className="relative">
            <span className="inline-flex items-center justify-center w-9 h-9 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-bold border border-purple-200 dark:border-purple-700/50">
              {category.subcategoryCount || 0}
            </span>
            {category.subcategoryCount && category.subcategoryCount > 0 && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "is_active",
      header: "STATUS",
      className: "w-32",
      render: (category) => (
        <div className="flex items-center justify-center">
          <div className="relative group">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                category.is_active
                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700/50"
                  : "bg-gradient-to-r from-red-500/20 to-rose-500/20 dark:from-red-500/30 dark:to-rose-500/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700/50"
              }`}
            >
              {category.is_active ? (
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
                category.is_active
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
      render: (category) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(category._id, category.is_active);
            }}
            className={`group relative px-3 py-1.5 rounded text-xs font-medium transition-all duration-300 hover:scale-105 ${
              category.is_active
                ? "bg-gradient-to-r from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 text-red-600 dark:text-red-400 hover:from-red-500/20 hover:to-rose-500/20 dark:hover:from-red-500/30 dark:hover:to-rose-500/30 border border-red-200 dark:border-red-700/50"
                : "bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 text-green-600 dark:text-green-400 hover:from-green-500/20 hover:to-emerald-500/20 dark:hover:from-green-500/30 dark:hover:to-emerald-500/30 border border-green-200 dark:border-green-700/50"
            }`}
          >
            <div className="flex items-center gap-1.5">
              {category.is_active ? (
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
              handleEditCategory(category);
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
              handleDeleteCategory(category._id, category.name);
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

  const handleRowClick = (category: CategoryItem) => {
    // Optional: You can use this for viewing details
    console.log("View category:", category);
  };

  return (
    <div className="space-y-6">
      {/* Header Section - Futuristic */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-200 dark:border-cyan-700/50 flex items-center justify-center">
              <CircuitBoard className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-500 bg-clip-text text-transparent">
              Categories
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Manage and organize your service category ecosystem
            </p>
          </div>
        </div>

        {/* Add Category Button - Futuristic */}
        <Button
          onClick={handleAddCategory}
          className="group relative bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white h-11 px-5 rounded shadow-cyan-500/20 dark:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
          size="sm"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="font-semibold">New Category</span>
          </div>
          <div className="absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-500/20 to-blue-500/20"></div>
        </Button>
      </div>

      {/* Stats Cards - Futuristic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Categories"
          value={categoryData.length}
          icon={Database}
          color="cyan"
          total={categoryData.length}
          unit="categories"
          compact={false}
        />

        <StatsCard
          title="Active"
          value={categoryData.filter((c) => c.is_active).length}
          icon={Server}
          color="emerald"
          total={categoryData.length}
          unit="online"
          compact={false}
        />

        <StatsCard
          title="Inactive"
          value={categoryData.filter((c) => !c.is_active).length}
          icon={Network}
          color="rose"
          total={categoryData.length}
          unit="offline"
          compact={false}
        />

        <StatsCard
          title="Subcategories"
          value={categoryData.reduce(
            (acc, c) => acc + (c.subcategoryCount || 0),
            0
          )}
          icon={Layers}
          color="purple"
          total={categoryData.reduce(
            (acc, c) => acc + (c.subcategoryCount || 0),
            0
          )}
          unit="subcats"
          compact={false}
        />
      </div>

      {/* Categories Table - Futuristic Design */}
      <div className="">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/30 bg-gradient-to-r from-gray-50/50 to-white/30 dark:from-gray-800/20 dark:to-gray-900/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Category Data
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700/30">
                {categoryData.length} total
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
          columns={categoryColumns}
          staticURL={staticURL}
          keyField="_id"
          emptyMessage="No categories found. Initialize the category matrix to begin."
          emptyIcon={
            <div className="text-gray-400 dark:text-gray-600">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <FolderTree className="w-8 h-8" />
              </div>
            </div>
          }
          emptyAction={
            <Button
              onClick={handleAddCategory}
              className="mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20"
            >
              <Zap className="w-4 h-4 mr-2" />
              Initialize Category
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
            totalItems: categoryData.length,
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
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/30 dark:to-blue-500/30 flex items-center justify-center">
                {isEditing ? (
                  <Edit className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                ) : (
                  <Plus className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-500 bg-clip-text text-transparent">
                  {isEditing ? "Edit Category" : "Create New Category"}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {isEditing
                    ? "Update the category configuration"
                    : "Initialize a new category node in the system"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Name and Slug */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) =>
                    setCategoryFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm transition-all duration-200"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={categoryFormData.slug}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded text-sm"
                  placeholder="Auto-generated slug"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm transition-all duration-200 resize-none"
                rows={2}
                value={categoryFormData.description}
                onChange={(e) =>
                  setCategoryFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter category description"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <ImageUploadSection
                onImageSelect={handleImageSelect}
                previewUrl={categoryFormData.category_image_url}
                label={`Category Image ${isEditing ? "(Optional)" : "*"}`}
                description="Upload a clear image that represents this category"
                compact={false}
                futuristic={true}
                allowClear={true}
              />
            </div>

            {/* Active Toggle */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <ActiveToggle
                isActive={categoryFormData.is_active}
                onChange={(is_active) =>
                  setCategoryFormData((prev) => ({ ...prev, is_active }))
                }
                label="Category is active and visible to customers"
                id="categoryIsActive"
                futuristic={true}
              />
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
              onClick={handlePostCategory}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow shadow-cyan-500/20 dark:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
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
                      Update Category
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Create Category
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

export default CategoryTab;
