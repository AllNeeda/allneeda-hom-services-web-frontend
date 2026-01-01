'use client'

import Link from 'next/link'
import { ShieldX } from 'lucide-react'

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10 bg-white dark:bg-gray-900 min-h-screen px-2">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full">
                            <ShieldX className="w-12 h-12 text-red-600 dark:text-red-500" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Access Denied
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                        You do not have permission to access this page.
                        Please contact your administrator if you believe this is a mistake.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/auth/login"
                        className="block w-full py-2.5 px-4 bg-[#0077B6] hover:bg-[#006ca6] text-white font-medium rounded-lg transition duration-200 text-sm text-center"
                    >
                        Go to Login
                    </Link>

                    <Link
                        href="/home-services"
                        className="block w-full py-2.5 px-4 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition duration-200 text-sm text-center"
                    >
                        Return to Home
                    </Link>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Need help?{' '}
                    <a
                        href="mailto:support@example.com"
                        className="text-[bg-[#0077B6] dark:text-[#0077B6] hover:text-[#006ca6] dark:hover:text-blue-300"
                    >
                        Contact Support
                    </a>
                </p>
            </div>
        </div>
    )
}