"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

type Stat = {
    title: string
    value: React.ReactNode
    subtitle?: string
    icon?: any
    color?: string
    bgColor?: string
    stars?: number
}

const StatsGrid = ({ stats }: { stats: Stat[] }) => {
    const totalReviews = stats.find(s => s.title === 'Total Reviews')?.value as number || 0

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white dark:bg-gray-900 rounded-sm p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:border-[#0077B6]/20 dark:hover:border-[#0077B6]/30"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                {stat.title}
                            </p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </span>
                                {stat.subtitle && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {stat.subtitle}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={`p-3 rounded-sm ${stat.bgColor}`}>
                            {stat.icon && <stat.icon className={`w-5 h-5 ${stat.color}`} />}
                        </div>
                    </div>

                    {stat.stars ? (
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(stat.stars as number)
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-300 dark:text-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(Number(stat.value) / (totalReviews || 1)) * 100}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={`absolute inset-y-0 left-0 rounded-full ${stat.color?.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-') || 'bg-[#0077B6]'} `}
                            />
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    )
}

export default StatsGrid
