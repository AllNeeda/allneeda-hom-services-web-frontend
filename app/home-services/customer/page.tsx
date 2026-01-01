// app/customer/welcome/simple/page.tsx
'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SimpleCustomerWelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10 bg-white dark:bg-gray-900 min-h-screen px-2">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <CheckCircle className="w-12 h-12 text-blue-600 dark:text-blue-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Aboard!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Your account is ready. Start exploring your dashboard.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link
            href="/customer/dashboard"
            className="block w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 text-sm text-center"
          >
            Go to Dashboard
          </Link>
          
          <Link
            href="/"
            className="block w-full py-2.5 px-4 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition duration-200 text-sm text-center"
          >
            Back to Home
          </Link>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Questions?{' '}
          <a 
            href="mailto:support@example.com" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Contact our team
          </a>
        </p>
      </div>
    </div>
  )
}