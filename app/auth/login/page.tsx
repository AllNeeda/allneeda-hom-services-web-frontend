'use client'

import React from "react"
import dynamic from "next/dynamic"

// Dynamically import login component
const Login = dynamic(() => import("@/components/auth/login/page"))

export default function LoginPage() {
  return (
      <div className="flex  flex-col items-center justify-center gap-6 p-6 md:p-10 bg-white dark:bg-gray-900  px-2">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Login />
        </div>
      </div>
  )
}