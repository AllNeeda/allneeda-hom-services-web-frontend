"use client";
import { getAccessToken } from "@/app/api/axios";
import { useDeleteActivateRanking, useGetRankingCampaign, useRankingStatus } from "@/hooks/useMarketing";
import React, { useState } from "react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Badge,
} from "@/components/ui/badge";
import {
    TrendingUp,
    Clock,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Trash,
    PowerOff,
    MoreVertical,
    Filter,
    MapPin,
    Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import GlobalLoader from "@/components/ui/global-loader";
import toast from "react-hot-toast";

interface RankingCampaign {
    _id: string;
    createdAt: string;
    credits_used: number;
    duration: string;
    end_date: string;
    location_id: {
        _id: string;
        state: string;
        city: string;
    };
    package_id: {
        _id: string;
        name: string;
        credits: number;
        price: number;
    };
    professional_id: string;
    service_id: {
        _id: string;
        service_name: string;
    };
    service_name: string;
    start_date: string;
    status: string;
}

export const RankingactiveList = ({ professionalId }: { professionalId: string }) => {
    const token = getAccessToken();
    const { data, error, isLoading, refetch } = useGetRankingCampaign(professionalId, token || "");
    const { mutate: updateStatus } = useRankingStatus();
    const { mutate: deleteRanking } = useDeleteActivateRanking();
    const campaignsData = data?.data || [];
    const campaignsArray: RankingCampaign[] = Array.isArray(campaignsData) ? campaignsData : campaignsData ? [campaignsData] : [];
    const [sortField] = useState("start_date");
    const [sortDirection] = useState<"asc" | "desc">("desc");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<RankingCampaign | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Calculate days remaining
    const getDaysRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    const formatDuration = (duration: string) => {
        switch (duration.toLowerCase()) {
            case "monthly":
                return "Monthly";
            case "weekly":
                return "Weekly";
            case "annaul":
                return "annaul";
            default:
                return duration;
        }
    };
    const getStatusConfig = (status: string): {
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: React.ReactNode;
        className?: string;
    } => {
        switch (status?.toLowerCase()) {
            case "active":
                return {
                    variant: "default" as const,
                    className: "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-900",
                    icon: <div className="h-2 w-2 rounded-sm bg-green-500" />,
                };
            case "expired":
                return {
                    variant: "destructive" as const,
                    icon: <div className="h-2 w-2 rounded-sm bg-red-500" />,
                };
            case "inactive":
                return {
                    variant: "secondary" as const,
                    className: "bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400 border-gray-200 dark:border-gray-700",
                    icon: <div className="h-2 w-2 rounded-sm bg-gray-500" />,
                };
            case "pending":
                return {
                    variant: "outline" as const,
                    className: "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
                    icon: <div className="h-2 w-2 rounded-sm bg-yellow-500" />,
                };
            default:
                return {
                    variant: "secondary" as const,
                    icon: <div className="h-2 w-2 rounded-sm bg-gray-500" />,
                };
        }
    };

    // Handle delete campaign
    const handleDeleteCampaign = async () => {
        if (!selectedCampaign || !token) return;

        setActionLoading(true);
        try {
            deleteRanking(
                { campaign_id: selectedCampaign._id, token },
                {
                    onSuccess: () => {
                        toast.success("Campaign deleted successfully");
                        refetch();
                        setDeleteDialogOpen(false);
                        setActionLoading(false);
                        setSelectedCampaign(null);
                    },
                }
            );
        } catch {
            setActionLoading(false);
        }
    };
    const handleDeactivateCampaign = async () => {
        if (!selectedCampaign || !token) return;

        setActionLoading(true);
        try {
            const newStatus = selectedCampaign.status === "active" ? "inactive" : "active";

            await updateStatus(
                {
                    campaign_id: selectedCampaign._id,
                    status: newStatus,
                    token
                },
                {
                    onSuccess: () => {
                        toast.success(`Campaign ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
                        refetch();
                        setDeactivateDialogOpen(false);
                        setActionLoading(false);
                        setSelectedCampaign(null);
                    },
                }
            );
        } catch {
            setActionLoading(false);
        }
    };
    const filteredCampaigns = campaignsArray
        .filter((campaign) => {
            if (filterStatus === "all") return true;
            return campaign.status?.toLowerCase() === filterStatus.toLowerCase();
        })
        .sort((a, b) => {
            if (sortField === "start_date" || sortField === "end_date") {
                const dateA = new Date(a[sortField]).getTime();
                const dateB = new Date(b[sortField]).getTime();
                return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
            }
            if (sortField === "credits_used") {
                return sortDirection === "asc"
                    ? (a[sortField] || 0) - (b[sortField] || 0)
                    : (b[sortField] || 0) - (a[sortField] || 0);
            }
            return 0;
        });
    const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

    if (isLoading) {
        return (
            <GlobalLoader />
        );
    }
    if (error) {
        return (
            <div className="dark:from-gray-900 dark:to-gray-900 py-6 sm:py-8 flex items-center justify-center">
                <Card className="w-full max-w-md border border-gray-200 dark:border-gray-700 mx-3">
                    <CardContent className="p-4 sm:p-4 text-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900/20 rounded-sm flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
                            Error Loading Data
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 px-2">
                            {error.message || "Failed to load ranking campaigns data"}
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="from-[#0077B6] to-[#40A4FF] text-white hover:from-[#0066A0] hover:to-[#3594EA] w-full sm:w-auto"
                        >
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="dark:from-gray-900 dark:to-gray-900">
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 className="text-sm  text-[#0077B6] mb-3 flex items-center gap-2">
                                Ranking Campaigns
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs sm:text-sm">
                                Manage and monitor all your ranking boost campaigns
                            </p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="hidden sm:flex items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
                        </div>

                        <div className="grid grid-cols-2 sm:flex sm:items-center sm:gap-3 w-full">
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full h-9 sm:h-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-xs sm:text-sm">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <SelectValue placeholder="All Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                    <SelectItem value="all" className="text-sm">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="active" className="text-sm">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive" className="text-sm">
                                        Inactive
                                    </SelectItem>
                                    <SelectItem value="expired" className="text-sm">
                                        Expired
                                    </SelectItem>
                                    <SelectItem value="pending" className="text-sm">
                                        Pending
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {filteredCampaigns.length === 0 ? (
                    <Card className="border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 dark:bg-blue-900/20 rounded-sm flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm max-w-md mx-auto px-4">
                                {filterStatus !== "all"
                                    ? `No ${filterStatus} ranking campaigns available. Try changing your filters.`
                                    : "No ranking campaigns available. Create your first campaign to boost your rankings."}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Desktop Table - Hidden on mobile */}
                        <div className="hidden lg:block overflow-x-auto rounded-sm border border-gray-200 dark:border-gray-700 mb-6">
                            <div className="min-w-full">
                                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                    <div className="col-span-3">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 text-[13px]">
                                            Campaign Details
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 text-[13px]">Service</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 text-[13px]">Location</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 text-[13px]">Package & Expire</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 text-[13px]">Status</span>
                                    </div>
                                    <div className="col-span-1 text-right">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 text-[13px]">Actions</span>
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {paginatedCampaigns.map((campaign: RankingCampaign, index: number) => {
                                        const statusConfig = getStatusConfig(campaign.status);
                                        const daysRemaining = getDaysRemaining(campaign.end_date);
                                        const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 7;
                                        const isExpired = daysRemaining <= 0;

                                        return (
                                            <motion.div
                                                key={campaign._id || index}
                                                layout
                                                className={`group transition-all duration-300 ${isExpired
                                                    ? "bg-gray-50 dark:bg-gray-900/50"
                                                    : "bg-white dark:bg-gray-900"
                                                    } hover:bg-gray-50 dark:hover:bg-gray-750`}
                                            >
                                                <div className="grid grid-cols-12 gap-4 p-4 items-center">
                                                    {/* Campaign Details */}
                                                    <div className="col-span-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 from-[#0077B6] to-[#40A4FF] rounded-sm flex items-center justify-center">
                                                                <TrendingUp className="w-5 h-5 text-[#0077B6]" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h3 className="font-semibold text-gray-900 dark:text-white text-[13px]">
                                                                    {campaign.package_id?.name || "Ranking Boost"}
                                                                </h3>
                                                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                                                    {campaign.credits_used} Credits
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Service */}
                                                    <div className="col-span-2">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 text-gray-900 dark:text-white text-[13px]">
                                                                <span>{campaign.service_name || campaign.service_id?.service_name || "N/A"}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Location */}
                                                    <div className="col-span-2">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 text-gray-900 dark:text-white text-[13px]">
                                                                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                                                <span>
                                                                    {campaign.location_id?.city}  {campaign.location_id?.state}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Package & Duration */}
                                                    <div className="col-span-2">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-gray-900 dark:text-white text-[13px]">
                                                                <Package className="w-3.5 h-3.5 text-gray-500" />
                                                                <span>{formatDuration(campaign.duration)}</span>
                                                            </div>
                                                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                                                                {formatDate(campaign.end_date)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Status */}
                                                    <div className="col-span-2">
                                                        <div className="flex flex-col gap-2">
                                                            <Badge
                                                                variant={statusConfig.variant}
                                                                className={cn(
                                                                    "flex items-center gap-2 rounded-sm text-[12px] py-1",
                                                                    statusConfig.className
                                                                )}
                                                            >
                                                                {statusConfig.icon}
                                                                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                                            </Badge>
                                                            {isExpiringSoon && !isExpired && (
                                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs border border-yellow-200 dark:border-yellow-800">
                                                                    <Clock className="w-3 h-3" />
                                                                    {daysRemaining} days left
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="col-span-1">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                    >
                                                                        <MoreVertical className="w-4 h-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent
                                                                    align="end"
                                                                    className="w-48 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                                                >
                                                                    <DropdownMenuItem
                                                                        className="text-[13px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                        onClick={() => {
                                                                            setSelectedCampaign(campaign);
                                                                            setDeactivateDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <PowerOff className="w-4 h-4 mr-2" />
                                                                        {campaign.status === "active" ? "Deactivate" : "Activate"}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                                                                    <DropdownMenuItem
                                                                        className="text-red-600 dark:text-red-400 text-[13px] cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                        onClick={() => {
                                                                            setSelectedCampaign(campaign);
                                                                            setDeleteDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <Trash className="w-4 h-4 mr-2" />
                                                                        Delete Campaign
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Mobile & Tablet Cards */}
                        <div className="lg:hidden space-y-4 mb-6">
                            {paginatedCampaigns.map((campaign: RankingCampaign, index: number) => {
                                const statusConfig = getStatusConfig(campaign.status);
                                const daysRemaining = getDaysRemaining(campaign.end_date);
                                const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 7;
                                const isExpired = daysRemaining <= 0;

                                return (
                                    <Card
                                        key={campaign._id || index}
                                        className="border border-gray-200 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <CardContent className="p-4 space-y-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-11 h-11 rounded-sm from-[#0077B6] to-[#40A4FF] flex items-center justify-center shrink-0">
                                                        <TrendingUp className="w-5 h-5 text-[#0077B6]" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                            {campaign.package_id?.name || "Ranking Boost"}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                            {campaign.credits_used} credits • {formatDuration(campaign.duration)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                                                        >
                                                            <MoreVertical className="w-5 h-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-52 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedCampaign(campaign);
                                                                setDeactivateDialogOpen(true);
                                                            }}
                                                            className="cursor-pointer text-sm"
                                                        >
                                                            <PowerOff className="w-4 h-4 mr-2" />
                                                            {campaign.status === "active" ? "Deactivate" : "Activate"}
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedCampaign(campaign);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                            className="cursor-pointer text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        >
                                                            <Trash className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Info Grid */}
                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div className="space-y-1">
                                                    <p className="text-gray-500 dark:text-gray-400">Service</p>
                                                    <p className="text-gray-900 dark:text-white font-medium truncate">
                                                        {campaign.service_name || campaign.service_id?.service_name || "N/A"}
                                                    </p>
                                                </div>

                                                <div className="space-y-1">
                                                    <p className="text-gray-500 dark:text-gray-400">Location</p>
                                                    <p className="text-gray-900 dark:text-white font-medium truncate">
                                                        {campaign.location_id?.city} {campaign.location_id?.state}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div className="space-y-1">
                                                    <p className="text-gray-500 dark:text-gray-400">Expiry Date</p>
                                                    <p className="text-gray-900 dark:text-white font-medium">
                                                        {formatDate(campaign.end_date)}
                                                    </p>
                                                </div>

                                                <div className="space-y-1">
                                                    <p className="text-gray-500 dark:text-gray-400">Credits Used</p>
                                                    <p className="text-gray-900 dark:text-white font-medium">
                                                        {campaign.credits_used}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status Row */}
                                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge
                                                        variant={statusConfig.variant}
                                                        className={cn(
                                                            "flex items-center gap-1.5 text-xs px-3 py-1 rounded-sm",
                                                            statusConfig.className
                                                        )}
                                                    >
                                                        {statusConfig.icon}
                                                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                                    </Badge>

                                                    {isExpiringSoon && !isExpired && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs border border-yellow-200 dark:border-yellow-800">
                                                            <Clock className="w-3 h-3" />
                                                            {daysRemaining} days left
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Card className="border border-gray-200 dark:border-gray-700">
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                                            Showing{" "}
                                            <span className="font-semibold text-gray-900 dark:text-gray-200">
                                                {startIndex + 1}-{Math.min(endIndex, filteredCampaigns.length)}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-semibold text-gray-900 dark:text-gray-200">
                                                {filteredCampaigns.length}
                                            </span>{" "}
                                            campaigns
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            {/* Items per page */}
                                            <div className="w-full sm:w-auto">
                                                <Select
                                                    value={itemsPerPage.toString()}
                                                    onValueChange={(value) => {
                                                        setItemsPerPage(Number(value));
                                                        setCurrentPage(1);
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full sm:w-[140px] h-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm">
                                                        <SelectValue placeholder="Items per page" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                                        <SelectItem value="5" className="text-sm">
                                                            5 per page
                                                        </SelectItem>
                                                        <SelectItem value="10" className="text-sm">
                                                            10 per page
                                                        </SelectItem>
                                                        <SelectItem value="25" className="text-sm">
                                                            25 per page
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Page Navigation */}
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className="h-10 w-10 border-gray-300 dark:border-gray-600"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </Button>

                                                <div className="flex items-center space-x-1">
                                                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                                                        let pageNum: number;
                                                        if (totalPages <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage <= 2) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage >= totalPages - 1) {
                                                            pageNum = totalPages - 2 + i;
                                                        } else {
                                                            pageNum = currentPage - 1 + i;
                                                        }

                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => setCurrentPage(pageNum)}
                                                                className={cn(
                                                                    "h-10 min-w-40px text-sm",
                                                                    currentPage !== pageNum && "border-gray-300 dark:border-gray-600"
                                                                )}
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        );
                                                    })}

                                                    {totalPages > 3 && currentPage < totalPages - 1 && (
                                                        <>
                                                            <span className="text-gray-400 px-1">...</span>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setCurrentPage(totalPages)}
                                                                className="h-10 min-w-40px text-sm border-gray-300 dark:border-gray-600"
                                                            >
                                                                {totalPages}
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="h-10 w-10 border-gray-300 dark:border-gray-600"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 max-w-[95vw] sm:max-w-md mx-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">
                            Delete Ranking Campaign
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400 text-[13px]">
                            Are you sure you want to delete this ranking campaign? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                        <AlertDialogCancel
                            disabled={actionLoading}
                            className="w-full sm:w-auto order-2 sm:order-1 mt-0 border-gray-300 dark:border-gray-600 h-11"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={actionLoading}
                            onClick={handleDeleteCampaign}
                            className="w-full sm:w-auto order-1 sm:order-2 bg-red-600 hover:bg-red-700 text-white h-11"
                        >
                            {actionLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Deleting...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Trash className="w-4 h-4" />
                                    Delete Campaign
                                </span>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Deactivate/Activate Confirmation Dialog */}
            <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
                <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 max-w-[95vw] sm:max-w-md mx-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">
                            {selectedCampaign?.status === "active" ? "Deactivate" : "Activate"} Campaign
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400 text-[13px]">
                            Are you sure you want to {selectedCampaign?.status === "active" ? "deactivate" : "activate"} this
                            ranking campaign?
                            {selectedCampaign?.status === "active" &&
                                " The campaign will no longer boost your rankings."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                        <AlertDialogCancel
                            disabled={actionLoading}
                            className="w-full sm:w-auto order-2 sm:order-1 mt-0 border-gray-300 dark:border-gray-600 h-11"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={actionLoading}
                            onClick={handleDeactivateCampaign}
                            className={cn(
                                "w-full sm:w-auto order-1 sm:order-2 h-11",
                                selectedCampaign?.status === "active"
                                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                            )}
                        >
                            {actionLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    {selectedCampaign?.status === "active" ? "Deactivating..." : "Activating..."}
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <PowerOff className="w-4 h-4" />
                                    {selectedCampaign?.status === "active" ? "Deactivate" : "Activate"}
                                </span>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};