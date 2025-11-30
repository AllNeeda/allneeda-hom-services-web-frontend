"use client"

import {  useState } from "react"
import { Button } from "@/components/ui/button"
import { Grid2X2, Menu, Search} from "lucide-react"
import { CategoriesDropdown } from "./categories-dropdown"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import UserProfileDropdown from "./user-profile-dropdown"
import SidebarMenu from "./mobile-sidebar-menu"

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSignin = (val: boolean) => {
    setIsSignedIn(val)
  }

  return (
    <header className="bg-emerald-800 text-white relative">
      <div className="max-w-7xl mx-auto  py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-emerald-800 font-bold text-sm">S</span>
              </div>
              <Link href="/it-services/" className="text-xl font-bold">
                Servicyee
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <div className="relative" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                 <button className="hover:text-emerald-200 flex items-center space-x-1 py-2 px-3 rounded-lg hover:bg-emerald-700 transition-colors">
                  <Grid2X2 className="w-4 h-4" />
                  <span>Categories</span>
                  <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <CategoriesDropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} />
              </div>
              <Link href="/it-services/search/" className="hover:text-emerald-200">
                Browse 
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* lg+ full search input */}
            <div className="hidden lg:flex items-center relative">
              <Input
                type="search"
                placeholder="Search services"
                className="w-80 xl:w-96 bg-white/90 text-gray-900 pr-9"
              />
              <Search className="w-4 h-4 text-emerald-900 absolute right-3" />
            </div>
            {/* md-only search icon with popover */}
            <div className="hidden md:flex lg:hidden items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <button aria-label="Open search" className="p-2 rounded-md hover:bg-emerald-700 transition-colors">
                    <Search className="w-5 h-5 text-white" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" side="top" className="p-2 w-80">
                  <div className="relative">
                    <Input
                      autoFocus
                      type="search"
                      placeholder="Search services"
                      className="w-full bg-white/90 text-gray-900 pr-9"
                    />
                    <Search className="w-4 h-4 text-emerald-900 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Link href={'/it-services/become-seller/'}>
              <span className="hidden md:inline">Become a Seller</span>
            </Link>
            {/* Sign In Button or User Profile Dropdown */}
            {!isSignedIn ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsSignedIn(true)}
              >
                Sign In
              </Button>
            ) : (
              <UserProfileDropdown handleSignin={handleSignin} />
            )}
            <Button className="md:hidden" variant="ghost" size="sm" 
            onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  )
}
