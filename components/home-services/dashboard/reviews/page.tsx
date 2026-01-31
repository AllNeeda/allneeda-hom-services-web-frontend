"use client";

import { getAccessToken } from '@/app/api/axios'
import { useProfessionalReview } from '@/hooks/RegisterPro/useRegister'
import React, { useState, useMemo } from 'react'
import { Search, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import GlobalLoader from '@/components/ui/global-loader';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import StatsGrid from './StatsGrid'
import TabsNav from './TabsNav'
import ReviewsList from './ReviewsList'
import { } from './helpers'
import { useUpdateReviews } from '@/hooks/useReviews';
import { useRouter } from 'next/navigation';

const Reviews = () => {
    const token = getAccessToken() || ''
    const { data, isLoading } = useProfessionalReview(token)
    const { mutate: updateReview, isPending } = useUpdateReviews(token)
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'declined'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [expandedReview, setExpandedReview] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState('recent')

    const router = useRouter()
    const reviews = useMemo(() => data?.professional?.reviews || [], [data])
    const ratingAvg = data?.professional?.professional?.rating_avg || 0
    const totalReviews = reviews.length
    const stats = useMemo(() => {
        const pendingCount = reviews.filter((r: any) => r.review_type === 'pending').length
        const approvedCount = reviews.filter((r: any) => r.review_type === 'approved').length
        const declinedCount = reviews.filter((r: any) => r.review_type === 'declined').length

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        let totalRating = 0

        reviews.forEach((review: any) => {
            if (review.review_type === 'approved') {
                const rating = Math.round(review.rating)
                if (distribution[rating as keyof typeof distribution] !== undefined) {
                    distribution[rating as keyof typeof distribution]++
                }
                totalRating += review.rating
            }
        })

        return {
            distribution,
            pendingCount,
            approvedCount,
            declinedCount,
            avgRating: approvedCount > 0 ? totalRating / approvedCount : 0
        }
    }, [reviews])
    const filteredReviews = useMemo(() => {
        let result = reviews.filter((review: any) => {
            // Tab filtering
            if (activeTab === 'pending' && review.review_type !== 'pending') return false
            if (activeTab === 'approved' && review.review_type !== 'approved') return false
            if (activeTab === 'declined' && review.review_type !== 'declined') return false

            // Search filtering
            if (searchQuery && !review.message?.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !review.client_name?.toLowerCase().includes(searchQuery.toLowerCase())) return false






            // Tag filtering
            if (selectedTags.length > 0 && !review.tags?.some((tag: string) => selectedTags.includes(tag))) return false

            return true
        })

        switch (sortBy) {
            case 'recent':
                result.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                break
            case 'oldest':
                result.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                break
            case 'highest':
                result.sort((a: any, b: any) => b.rating - a.rating)
                break
            case 'lowest':
                result.sort((a: any, b: any) => a.rating - b.rating)
                break
        }

        return result
    }, [reviews, activeTab, searchQuery, selectedTags, sortBy])
    function handleAskForReview() {
        router.push('/home-services/dashboard/services/step-5?from=reviews')
    }

    const handleApproveReview = (reviewId: string) => {
        updateReview({
            ReviewId: reviewId,
            status: 'approved',
            token
        })
    }
    const handleDeclineReview = (reviewId: string) => {
        updateReview({
            ReviewId: reviewId,
            status: 'declined',
            token
        })
    }



    // Reply functionality removed: replies are no longer handled from this UI

    if (isLoading || isPending) {
        return <GlobalLoader />
    }

    if (!reviews.length) {
        return (
            <div className=" dark:bg-gray-900 p-6 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Review Not Found...!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        No reviews have been submitted yet.
                    </p>
                    <Button onClick={() => handleAskForReview()}
                        className="mt-2 items-center text-sm rounded-sm px-2 py-2 bg-[#0077B6] hover:bg-[#0066A3] text-white shadow-sm"
                        aria-label="Ask for a review"
                    >
                        <Send className="w-4 h-4" />
                        <span>Ask Review</span>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 bg-[#0077B6]/10 dark:bg-[#0077B6]/20 rounded-sm px-4 py-2 border border-[#0077B6]/20 dark:border-[#0077B6]/30">
                                <div className="w-2 h-2 bg-[#0077B6] dark:bg-[#0077B6]/80 rounded-full animate-pulse" />
                                <span className="text-sm font-medium text-[#0077B6] dark:text-[#0077B6]/80">
                                    Reviews Management
                                </span>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    Client Reviews
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Manage and moderate client feedback
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={() => handleAskForReview()}
                                className="flex items-center gap-2 text-sm rounded-sm px-2 py-2 bg-[#0077B6] hover:bg-[#0066A3] text-white shadow-sm"
                                aria-label="Ask for a review"
                            >
                                <Send className="w-4 h-4" />
                                <span>Ask Review</span>
                            </Button>
                        </div>
                    </div>

                    <StatsGrid stats={[
                        {
                            title: "Average Rating",
                            value: ratingAvg.toFixed(1),
                            subtitle: "/5 stars",
                            icon: undefined,
                            color: "text-[#0077B6] dark:text-[#0077B6]/80",
                            bgColor: "bg-[#0077B6]/10 dark:bg-[#0077B6]/20",
                            stars: ratingAvg
                        },
                        {
                            title: "Total Reviews",
                            value: totalReviews,
                            subtitle: "reviews",
                            icon: undefined,
                            color: "text-[#6742EE] dark:text-[#6742EE]/80",
                            bgColor: "bg-[#6742EE]/10 dark:bg-[#6742EE]/20"
                        },
                        {
                            title: "Pending",
                            value: stats.pendingCount,
                            subtitle: "awaiting action",
                            icon: undefined,
                            color: "text-[#FF9500] dark:text-[#FF9500]/80",
                            bgColor: "bg-[#FF9500]/10 dark:bg-[#FF9500]/20"
                        },
                        {
                            title: "Approved",
                            value: stats.approvedCount,
                            subtitle: "public reviews",
                            icon: undefined,
                            color: "text-[#6742EE] dark:text-[#6742EE]/80",
                            bgColor: "bg-[#6742EE]/10 dark:bg-[#6742EE]/20"
                        }
                    ]} />
                </div>

                <TabsNav activeTab={activeTab} setActiveTab={setActiveTab} counts={{ total: totalReviews, pending: stats.pendingCount, approved: stats.approvedCount, declined: stats.declinedCount }} />

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search reviews by client name or content..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0077B6] focus:border-[#0077B6] dark:focus:ring-[#0077B6]/80 dark:focus:border-[#0077B6]/80 transition-all text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Filter
                    </Button>
                </div>

                {/* Reviews List */}
                <div className="bg-white dark:bg-gray-900 rounded-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {activeTab === 'all' ? 'All' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Reviews ({filteredReviews.length})
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {filteredReviews.length} of {totalReviews} total reviews
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-40 text-sm  bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white  dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                        <SelectItem value="recent">Most Recent</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="highest">Highest Rated</SelectItem>
                                        <SelectItem value="lowest">Lowest Rated</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <ReviewsList
                            reviews={filteredReviews}
                            expandedReview={expandedReview}
                            setExpandedReview={setExpandedReview}
                            handleApproveReview={handleApproveReview}
                            handleDeclineReview={handleDeclineReview}
                        />

                        {/* Empty State */}
                        {filteredReviews.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 rounded-sm border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                            >
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                                    No {activeTab !== 'all' ? activeTab : ''} reviews found
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto mb-6">
                                    {activeTab === 'pending'
                                        ? 'All reviews have been processed. Check approved or declined tabs.'
                                        : 'Try adjusting your filters or search terms.'}
                                </p>
                                <Button
                                    onClick={() => {
                                        setActiveTab('all')
                                        setSearchQuery('')
                                        setSelectedTags([])
                                    }}
                                    className="bg-[#0077B6] hover:bg-[#0066A3] text-white"
                                >
                                    Reset Filters
                                </Button>
                            </motion.div>
                        )}

                        {/* Load More */}
                        {filteredReviews.length > 5 && (
                            <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    variant="outline"
                                    className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Load More Reviews
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reviews