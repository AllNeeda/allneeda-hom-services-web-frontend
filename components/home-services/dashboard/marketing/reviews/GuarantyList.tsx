"use client";

import { getAccessToken } from '@/app/api/axios'
import GlobalLoader from '@/components/ui/global-loader';
import { useGetServices } from '@/hooks/useServices'
import React, { useState } from 'react'
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
    Shield,
    Percent,
    Clock,
    Edit,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Trash,
    PowerOff,
    MoreVertical,
    Eye,
    Filter,
    DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';


// Add these imports if you don't have them already
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
import { toast } from "sonner";

const GuarantyList = () => {
    const token = getAccessToken() || '';
    const { data, error, isLoading, refetch } = useGetServices(token)
    const guarantees = data?.services?.guarantee || null
    const guaranteeArray = Array.isArray(guarantees) ? guarantees : guarantees ? [guarantees] : []

    // State management
    const [sortField] = useState('start_date')
    const [sortDirection] = useState<'asc' | 'desc'>('desc')
    const [filterStatus, setFilterStatus] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
    const [selectedGuarantee, setSelectedGuarantee] = useState<any>(null)
    const [actionLoading, setActionLoading] = useState(false)

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    // Calculate days remaining
    const getDaysRemaining = (endDate: string) => {
        const end = new Date(endDate)
        const today = new Date()
        const diffTime = end.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    // Get status configuration
    const getStatusConfig = (status: string): {
        variant: "default" | "secondary" | "destructive" | "outline",
        icon: React.ReactNode,
        className?: string
    } => {
        switch (status?.toLowerCase()) {
            case 'active':
                return {
                    variant: "default" as const,
                    className: "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-900",
                    icon: (
                        <div className="h-2 w-2 rounded-sm bg-green-500" />
                    )
                }
            case 'expired':
                return {
                    variant: "destructive" as const,
                    icon: (
                        <div className="h-2 w-2 rounded-sm bg-red-500" />
                    )
                }
            case 'inactive':
                return {
                    variant: "secondary" as const,
                    className: "bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400 border-gray-200 dark:border-gray-700",
                    icon: (
                        <div className="h-2 w-2 rounded-sm bg-gray-500" />
                    )
                }
            default:
                return {
                    variant: "secondary" as const,
                    icon: (
                        <div className="h-2 w-2 rounded-sm bg-gray-500" />
                    )
                }
        }
    }

    // Handle delete guarantee
    const handleDeleteGuarantee = async () => {
        if (!selectedGuarantee) return

        setActionLoading(true)
        try {
            // Add your delete API call here
            // await deleteGuarantee(selectedGuarantee.id)
            refetch() // Refresh the data
            setDeleteDialogOpen(false)
            toast.success("Guarantee deleted successfully")
        } catch {
            toast.error("Failed to delete guarantee")
        } finally {
            setActionLoading(false)
            setSelectedGuarantee(null)
        }
    }

    const handleDeactivateGuarantee = async () => {
        if (!selectedGuarantee) return

        setActionLoading(true)
        try {
            // Add your deactivate/activate API call here
            // await toggleGuaranteeStatus(selectedGuarantee.id)
            await new Promise(resolve => setTimeout(resolve, 1000))
            refetch() // Refresh the data
            setDeactivateDialogOpen(false)
            toast.success(`Guarantee ${selectedGuarantee.status === 'active' ? 'deactivated' : 'activated'} successfully`)
        } catch {
            toast.error(`Failed to ${selectedGuarantee.status === 'active' ? 'deactivate' : 'activate'} guarantee`)
        } finally {
            setActionLoading(false)
            setSelectedGuarantee(null)
        }
    }

    // Filter and sort guarantees
    const filteredGuarantees = guaranteeArray
        .filter(guarantee => {
            if (filterStatus === 'all') return true
            return guarantee.status?.toLowerCase() === filterStatus.toLowerCase()
        })
        .sort((a, b) => {
            if (sortField === 'start_date' || sortField === 'end_date') {
                const dateA = new Date(a[sortField]).getTime()
                const dateB = new Date(b[sortField]).getTime()
                return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
            }
            if (sortField === 'credits' || sortField === 'billing_discount') {
                return sortDirection === 'asc'
                    ? (a[sortField] || 0) - (b[sortField] || 0)
                    : (b[sortField] || 0) - (a[sortField] || 0)
            }
            return 0
        })

    // Pagination calculations
    const totalPages = Math.ceil(filteredGuarantees.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedGuarantees = filteredGuarantees.slice(startIndex, endIndex)

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <GlobalLoader />
            </div>
        )
    }

    if (error) {
        return (
            <div className=" dark:from-gray-900 dark:to-gray-800 px-3 sm:px-4 py-6 sm:py-8 flex items-center justify-center">
                <Card className="w-full max-w-md border border-gray-200 dark:border-gray-700 mx-3">
                    <CardContent className="p-6 sm:p-8 text-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900/20 rounded-sm flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Error Loading Data
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6 px-2">
                            {error.message || 'Failed to load guarantee data'}
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-r from-[#0077B6] to-[#40A4FF] text-white hover:from-[#0066A0] hover:to-[#3594EA] w-full sm:w-auto"
                        >
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className=" dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-xl font-bold text-gray-900 dark:text-gray-100">
                                Service Guarantees
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs sm:text-sm">
                                Manage and monitor all your service guarantees
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                className="text-xs sm:text-sm bg-gradient-to-r from-[#0077B6] to-[#40A4FF] text-white hover:from-[#0066A0] hover:to-[#3594EA] h-9 sm:h-10 px-3 sm:px-4"
                            >
                                + New Guarantee
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                        <div className="hidden sm:flex items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Filter:
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:flex sm:items-center sm:gap-3 w-full">
                            <Select
                                value={filterStatus}
                                onValueChange={setFilterStatus}
                            >
                                <SelectTrigger className="w-full h-9 sm:h-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs sm:text-sm">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <SelectValue placeholder="All Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <SelectItem value="all" className="text-sm">All Status</SelectItem>
                                    <SelectItem value="active" className="text-sm">Active</SelectItem>
                                    <SelectItem value="inactive" className="text-sm">Inactive</SelectItem>
                                    <SelectItem value="expired" className="text-sm">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {filteredGuarantees.length === 0 ? (
                    <Card className="border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 dark:bg-blue-900/20 rounded-sm flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                No guarantees found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base max-w-md mx-auto px-4">
                                {filterStatus !== 'all'
                                    ? `No ${filterStatus} guarantees available. Try changing your filters.`
                                    : 'No guarantees available. Create your first guarantee to get started.'}
                            </p>
                            {filterStatus !== 'all' ? (
                                <Button
                                    variant="ghost"
                                    onClick={() => setFilterStatus('all')}
                                    className="text-[#0077B6] hover:text-[#0066A0] dark:text-blue-400 text-sm"
                                >
                                    View all guarantees →
                                </Button>
                            ) : (
                                <Button className="bg-gradient-to-r from-[#0077B6] to-[#40A4FF] text-white hover:from-[#0066A0] hover:to-[#3594EA] text-sm h-10">
                                    Create New Guarantee
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Desktop Table - Hidden on mobile */}
                        <div className="hidden lg:block overflow-x-auto rounded-sm border border-gray-200 dark:border-gray-700 mb-6">
                            <div className="min-w-full">
                                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                    <div className="col-span-3">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">Guarantee Details</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">Period</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">Costs</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">Status</span>
                                    </div>
                                    <div className="col-span-3 text-right">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">Actions</span>
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {paginatedGuarantees.map((guarantee: any, index: number) => {
                                        const statusConfig = getStatusConfig(guarantee.status)
                                        const daysRemaining = getDaysRemaining(guarantee.end_date)
                                        const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 7
                                        const isExpired = daysRemaining <= 0

                                        return (
                                            <motion.div
                                                key={guarantee._id || index}
                                                layout
                                                className={`group transition-all duration-300 ${isExpired
                                                    ? 'bg-gray-50 dark:bg-gray-800/50'
                                                    : 'bg-white dark:bg-gray-800'
                                                    } hover:bg-gray-50 dark:hover:bg-gray-750`}
                                            >
                                                <div className="grid grid-cols-12 gap-4 p-4 items-center">
                                                    {/* Guarantee Details */}
                                                    <div className="col-span-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-r from-[#0077B6] to-[#40A4FF] rounded-sm flex items-center justify-center flex-shrink-0">
                                                                <Shield className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                                    {guarantee.guarantee_name || 'Unnamed Guarantee'}
                                                                </h3>
                                                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 truncate">
                                                                    {guarantee.guarantee_type || 'Standard Guarantee'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Period */}
                                                    <div className="col-span-2">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1 text-gray-900 dark:text-white text-sm">
                                                                <span>{formatDate(guarantee.start_date)}</span>
                                                            </div>
                                                            <div className="text-gray-500 dark:text-gray-400 text-xs pl-5">
                                                                to {formatDate(guarantee.end_date)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Costs */}
                                                    <div className="col-span-2">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-2 text-gray-900 dark:text-white text-sm">
                                                                <span>{guarantee.credits || 0} credits</span>
                                                            </div>
                                                            {guarantee.billing_discount > 0 && (
                                                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs">
                                                                    <Percent className="w-3 h-3" />
                                                                    <span>{guarantee.billing_discount}% discount</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Status */}
                                                    <div className="col-span-2">
                                                        <div className="flex flex-col gap-2">
                                                            <Badge
                                                                variant={statusConfig.variant}
                                                                className={cn(
                                                                    "flex items-center gap-1.5 text-xs w-fit",
                                                                    statusConfig.className
                                                                )}
                                                            >
                                                                {statusConfig.icon}
                                                                {guarantee.status?.toUpperCase() || 'N/A'}
                                                            </Badge>
                                                            {isExpiringSoon && !isExpired && (
                                                                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 text-xs border border-yellow-200 dark:border-yellow-800 w-fit">
                                                                    <Clock className="w-3 h-3" />
                                                                    Expiring in {daysRemaining} days
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="col-span-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                onClick={() => {
                                                                    // View details
                                                                    console.log('View/Edit', guarantee)
                                                                }}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                onClick={() => {
                                                                    // Edit action
                                                                    console.log('Edit', guarantee)
                                                                }}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>

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
                                                                <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                                                    <DropdownMenuItem
                                                                        className="text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                        onClick={() => {
                                                                            setSelectedGuarantee(guarantee)
                                                                            setDeactivateDialogOpen(true)
                                                                        }}
                                                                    >
                                                                        <PowerOff className="w-4 h-4 mr-2" />
                                                                        {guarantee.status === 'active' ? 'Deactivate' : 'Activate'}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                                                                    <DropdownMenuItem
                                                                        className="text-red-600 dark:text-red-400 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                        onClick={() => {
                                                                            setSelectedGuarantee(guarantee)
                                                                            setDeleteDialogOpen(true)
                                                                        }}
                                                                    >
                                                                        <Trash className="w-4 h-4 mr-2" />
                                                                        Delete Guarantee
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Mobile & Tablet Cards - Hidden on desktop */}
                        <div className="lg:hidden space-y-3 mb-6">
                            {paginatedGuarantees.map((guarantee: any, index: number) => {
                                const statusConfig = getStatusConfig(guarantee.status)
                                const daysRemaining = getDaysRemaining(guarantee.end_date)
                                const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 7
                                const isExpired = daysRemaining <= 0

                                return (
                                    <Card key={guarantee._id || index} className="border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <CardContent className="p-4">
                                            {/* Card Header */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-[#0077B6] to-[#40A4FF] rounded-sm flex items-center justify-center flex-shrink-0">
                                                        <Shield className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                                                            {guarantee.guarantee_name || 'Unnamed Guarantee'}
                                                        </h3>
                                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5 truncate">
                                                            {guarantee.guarantee_type || 'Standard Guarantee'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Mobile Actions Dropdown */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 ml-2"
                                                        >
                                                            <MoreVertical className="w-5 h-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                                        <DropdownMenuItem
                                                            className="text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => {
                                                                // View details
                                                                console.log('View', guarantee)
                                                            }}
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => {
                                                                // Edit action
                                                                console.log('Edit', guarantee)
                                                            }}
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit Guarantee
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => {
                                                                setSelectedGuarantee(guarantee)
                                                                setDeactivateDialogOpen(true)
                                                            }}
                                                        >
                                                            <PowerOff className="w-4 h-4 mr-2" />
                                                            {guarantee.status === 'active' ? 'Deactivate' : 'Activate'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                                                        <DropdownMenuItem
                                                            className="text-red-600 dark:text-red-400 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            onClick={() => {
                                                                setSelectedGuarantee(guarantee)
                                                                setDeleteDialogOpen(true)
                                                            }}
                                                        >
                                                            <Trash className="w-4 h-4 mr-2" />
                                                            Delete Guarantee
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs mb-1">
                                                        <span>Period</span>
                                                    </div>
                                                    <p className="text-gray-900 dark:text-white text-sm">
                                                        {formatDate(guarantee.start_date)}
                                                    </p>
                                                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                                                        to {formatDate(guarantee.end_date)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs mb-1">
                                                        <DollarSign className="w-3.5 h-3.5" />
                                                        <span>Credits</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-900 dark:text-white text-sm">
                                                        <span>{guarantee.credits || 0}</span>
                                                    </div>
                                                    {guarantee.billing_discount > 0 && (
                                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs mt-1">
                                                            <Percent className="w-3 h-3" />
                                                            <span>{guarantee.billing_discount}% discount</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Status Section */}
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant={statusConfig.variant}
                                                        className={cn(
                                                            "flex items-center gap-1.5 text-xs px-3 py-1",
                                                            statusConfig.className
                                                        )}
                                                    >
                                                        {statusConfig.icon}
                                                        {guarantee.status?.toUpperCase() || 'N/A'}
                                                    </Badge>
                                                    {isExpiringSoon && !isExpired && (
                                                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 text-xs border border-yellow-200 dark:border-yellow-800 animate-pulse">
                                                            <Clock className="w-3 h-3" />
                                                            {daysRemaining}d left
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 h-9 text-sm"
                                                    onClick={() => {
                                                        // View details
                                                        console.log('View', guarantee)
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 h-9 text-sm"
                                                    onClick={() => {
                                                        // Edit action
                                                        console.log('Edit', guarantee)
                                                    }}
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Card className="border border-gray-200 dark:border-gray-700">
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                                            Showing <span className="font-semibold text-gray-900 dark:text-gray-200">
                                                {startIndex + 1}-{Math.min(endIndex, filteredGuarantees.length)}
                                            </span> of{' '}
                                            <span className="font-semibold text-gray-900 dark:text-gray-200">
                                                {filteredGuarantees.length}
                                            </span> guarantees
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            {/* Items per page */}
                                            <div className="w-full sm:w-auto">
                                                <Select
                                                    value={itemsPerPage.toString()}
                                                    onValueChange={(value) => {
                                                        setItemsPerPage(Number(value))
                                                        setCurrentPage(1)
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full sm:w-[140px] h-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                                                        <SelectValue placeholder="Items per page" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                                        <SelectItem value="5" className="text-sm">5 per page</SelectItem>
                                                        <SelectItem value="10" className="text-sm">10 per page</SelectItem>
                                                        <SelectItem value="25" className="text-sm">25 per page</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Page Navigation */}
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className="h-10 w-10 border-gray-300 dark:border-gray-600"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </Button>

                                                <div className="flex items-center space-x-1">
                                                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                                                        let pageNum: number
                                                        if (totalPages <= 3) {
                                                            pageNum = i + 1
                                                        } else if (currentPage <= 2) {
                                                            pageNum = i + 1
                                                        } else if (currentPage >= totalPages - 1) {
                                                            pageNum = totalPages - 2 + i
                                                        } else {
                                                            pageNum = currentPage - 1 + i
                                                        }

                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => setCurrentPage(pageNum)}
                                                                className={cn(
                                                                    "h-10 min-w-[40px] text-sm",
                                                                    currentPage !== pageNum && "border-gray-300 dark:border-gray-600"
                                                                )}
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        )
                                                    })}

                                                    {totalPages > 3 && currentPage < totalPages - 1 && (
                                                        <>
                                                            <span className="text-gray-400 px-1">...</span>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setCurrentPage(totalPages)}
                                                                className="h-10 min-w-[40px] text-sm border-gray-300 dark:border-gray-600"
                                                            >
                                                                {totalPages}
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
                <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-w-[95vw] sm:max-w-md mx-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">
                            Delete Guarantee
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            Are you sure you want to delete {selectedGuarantee?.guarantee_name || 'this guarantee'}? This action cannot be undone.
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
                            onClick={handleDeleteGuarantee}
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
                                    Delete Guarantee
                                </span>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Deactivate/Activate Confirmation Dialog */}
            <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
                <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-w-[95vw] sm:max-w-md mx-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">
                            {selectedGuarantee?.status === 'active' ? 'Deactivate' : 'Activate'} Guarantee
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            Are you sure you want to {selectedGuarantee?.status === 'active' ? 'deactivate' : 'activate'} {selectedGuarantee?.guarantee_name || 'this guarantee'}?
                            {selectedGuarantee?.status === 'active' && " The guarantee will no longer be available for use."}
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
                            onClick={handleDeactivateGuarantee}
                            className={cn(
                                "w-full sm:w-auto order-1 sm:order-2 h-11",
                                selectedGuarantee?.status === 'active'
                                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                            )}
                        >
                            {actionLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    {selectedGuarantee?.status === 'active' ? 'Deactivating...' : 'Activating...'}
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <PowerOff className="w-4 h-4" />
                                    {selectedGuarantee?.status === 'active' ? 'Deactivate' : 'Activate'}
                                </span>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default GuarantyList