 'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { User, Settings, HelpCircle, LogOut, Wallet2, Logs } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

// eslint-disable-next-line 
export default function UserProfileDropdown({handleSignin}: {handleSignin: (val: boolean) => void}) {
    const [isSellerMode, setIsSellerMode] = useState(true) 
    const router = useRouter()
    const handleSwitchMode = () => {
        if (isSellerMode) {
          setIsSellerMode(false)
          router.push('/it-services/search/')
        } else {
          setIsSellerMode(true)
          router.push('/it-services/seller/')
        }
      }
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border-2 border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400">
        <Image 
          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face" 
          alt="User profile" 
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Image 
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face" 
            alt="User profile" 
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-gray-900">John Doe</div>
            <div className="text-sm text-gray-500">john.doe@example.com</div>
          </div>
        </div>
      </div>
      
      {/* Switch Button */}
      <div className="px-4 py-3">
        <button
          onClick={handleSwitchMode}
          className="w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        >
          {isSellerMode ? "Switch to Buyer" : "Switch to Seller"}
        </button>
      </div>
      
      <DropdownMenuItem className="flex items-center space-x-3 px-4 py-2.5 cursor-pointer"
        onClick={()=>{
          router.push('/it-services/buyer-profile/')
        }}
      >
        <User className="w-4 h-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center space-x-3 px-4 py-2.5 cursor-pointer"
      onClick={()=>{
        router.push('/it-services/buyer/orders/')
      }}
      >
        <Logs  className="w-4 h-4" />
        <span>Orders</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center space-x-3 px-4 py-2.5 cursor-pointer"
       onClick={()=>{
        router.push('/it-services/buyer/billing-history/')
      }}
      >
        <Wallet2 className="w-4 h-4" />
        <span>Billing History</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center space-x-3 px-4 py-2.5 cursor-pointer"
          onClick={()=>{
            router.push('/it-services/buyer/settings/')
          }}
      >
        <Settings className="w-4 h-4" />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center space-x-3 px-4 py-2.5 cursor-pointer">
        <HelpCircle className="w-4 h-4" />
        <span>Help & Support</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        className="flex items-center space-x-3 px-4 py-2.5 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
        onClick={() => handleSignin(false)}
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}