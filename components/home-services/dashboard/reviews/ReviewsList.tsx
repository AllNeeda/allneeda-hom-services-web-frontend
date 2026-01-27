"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Star,
    Shield,
    ChevronDown, ChevronUp, CheckCircle2,
    XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { capitalizeTag } from './helpers'

const ReviewsList = ({
    reviews,
    expandedReview,
    setExpandedReview,
    handleApproveReview,
    handleDeclineReview,
}: any) => {
    return (
        <AnimatePresence>
            <div className="space-y-4">
                {reviews.map((review: any, index: number) => (
                    <motion.div
                        key={review._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.03 }}
                        className="group bg-white dark:bg-gray-900 rounded-sm p-5 border border-gray-200 dark:border-gray-700 hover:border-[#0077B6]/20 dark:hover:border-[#0077B6]/30 transition-all hover:shadow-sm"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-[#0077B6] dark:bg-[#0077B6]/80 rounded-sm flex items-center justify-center text-white font-bold text-sm">
                                        {review.client_name?.charAt(0) || 'C'}
                                    </div>
                                    {review.verified && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#6742EE] rounded-sm flex items-center justify-center">
                                            <Shield className="w-2 h-2 text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {review.client_name || 'Anonymous Client'}
                                        </h4>
                                        <span className={`
                                            px-2 py-0.5 rounded-sm text-xs font-medium w-fit
                                                ${review.review_type === 'approved' ? 'bg-[#6742EE]/10 text-[#6742EE] dark:bg-[#6742EE]/20 dark:text-[#6742EE]/80' : ''}
                                        `}>
                                            {review.review_type
                                                ? review.review_type.charAt(0).toUpperCase() + review.review_type.slice(1)
                                                : 'Unknown'
                                            }
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 text-sm">
                                        <div className="flex items-center gap-1">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating
                                                            ? 'text-yellow-500 fill-yellow-500'
                                                            : 'text-gray-300 dark:text-gray-600'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {review.rating}.0
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">

                            <>
                                <p className={`text-sm mb-3 ${expandedReview === review._id ? '' : 'line-clamp-2'} text-gray-700 dark:text-gray-300`}>
                                    {review.message || 'The client left a rating without additional comments.'}
                                </p>
                                {review.message && review.message.length > 150 && (
                                    <button
                                        onClick={() => setExpandedReview(expandedReview === review._id ? null : review._id)}
                                        className="text-xs  font-medium flex items-center gap-0.5 text-[#0077B6] dark:text-[#0077B6]/80 hover:text-[#0066A3] dark:hover:text-[#0077B6]"
                                    >
                                        {expandedReview === review._id ? 'Show less' : 'Read more'}
                                        {expandedReview === review._id ? (
                                            <ChevronUp className="w-3 h-3" />
                                        ) : (
                                            <ChevronDown className="w-3 h-3" />
                                        )}
                                    </button>
                                )}
                            </>
                        </div>

                        {review.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                                {review.tags.map((tag: string, i: number) => (
                                    <span
                                        key={i}
                                        className=" py-1 rounded-sm text-xs bg-[#0077B6]/10 text-[#0077B6] border px-2 border-transparent dark:bg-[#0077B6]/20 dark:text-white dark:border-[#0077B6]/30"
                                    >
                                        {capitalizeTag(tag)}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800 gap-3 sm:gap-0">
                            <div className="flex flex-wrap gap-2">
                                <>
                                    <Button
                                        onClick={() => handleApproveReview(review._id)}
                                        size="sm"
                                        className={`h-8 px-3 rounded-sm text-xs mr-2 ${review.review_type === 'approved' ? 'border border-[#0077B6] text-[#0077B6] bg-white dark:bg-transparent dark:text-[#0077B6]/80' : 'border border-[#0077B6] bg-white dark:bg-transparent hover:bg-[#0066A3] hover:text-white dark:hover:bg-[#0066A3] dark:hover:text-white text-[#0077B6] dark:text-[#0077B6]/80'}`}
                                        disabled={review.review_type === 'approved'}
                                    >
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        {review.review_type === 'approved' ? 'Approved' : 'Approve'}
                                    </Button>

                                    <Button
                                        onClick={() => handleDeclineReview(review._id)}
                                        size="sm"
                                        variant={review.review_type === 'declined' ? undefined : 'destructive'}
                                        className={`h-8 px-3 text-xs rounded-sm ${review.review_type === 'declined' ? 'border border-[#0077B6] text-[#0077B6] bg-white dark:bg-transparent dark:text-[#0077B6]/80' : 'border border-[#0077B6] bg-white dark:bg-transparent hover:bg-[#0066A3] hover:text-white dark:hover:bg-[#0066A3] dark:hover:text-white text-[#0077B6] dark:text-[#0077B6]/80'}`}
                                        disabled={review.review_type === 'declined'}
                                    >
                                        <XCircle className="w-3 h-3 mr-1" />
                                        {review.review_type === 'declined' ? 'Declined' : 'Decline'}
                                    </Button>
                                </>
                            </div>
                        </div>



                        {review.replies?.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    Replies ({review.replies.length})
                                </h5>
                                <div className="space-y-2">
                                    {review.replies.map((reply: any, index: number) => (
                                        <div
                                            key={index}
                                            className="p-3 rounded-sm text-sm bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-medium">
                                                    {reply.author || 'Admin'}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(reply.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p>{reply.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </AnimatePresence>
    )
}

export default ReviewsList
